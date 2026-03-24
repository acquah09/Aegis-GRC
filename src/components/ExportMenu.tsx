// src/components/ExportMenu.tsx
// Export menu component with CSV and PDF export options

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import Papa from 'papaparse';

interface ExportMenuProps {
  dataType: 'risks' | 'compliance';
  data: any[];
  orgId: string;
  className?: string;
}

export function ExportMenu({ dataType, data, orgId, className }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'csv' | 'pdf' | null>(null);

  // CSV Export Function
  const exportToCSV = () => {
    try {
      setIsExporting(true);
      setExportType('csv');

      let csvData: any[] = [];
      let filename = '';

      if (dataType === 'risks') {
        // Prepare risks data for CSV
        csvData = data.map(risk => ({
          'Title': risk.title || '',
          'Category': risk.category || '',
          'Likelihood': risk.likelihood || 0,
          'Impact': risk.impact || 0,
          'Risk Score': risk.risk_score || 0,
          'Status': risk.status || '',
          'Owner': risk.owner_name || 'Unassigned',
          'Description': risk.description || '',
          'Treatment Plan': risk.treatment_plan || '',
          'Review Date': risk.review_date ? new Date(risk.review_date).toLocaleDateString() : '',
          'Created Date': risk.created_at ? new Date(risk.created_at).toLocaleDateString() : '',
        }));
        filename = `risks-export-${new Date().toISOString().split('T')[0]}.csv`;
      } else if (dataType === 'compliance') {
        // Prepare compliance data for CSV
        csvData = data.map(item => ({
          'Control Reference': item.control_ref || '',
          'Title': item.title || '',
          'Category': item.category || '',
          'Status': item.status || '',
          'Evidence URL': item.evidence_url || '',
          'Notes': item.notes || '',
          'Assigned To': item.assigned_to_name || 'Unassigned',
          'Due Date': item.due_date ? new Date(item.due_date).toLocaleDateString() : '',
          'Created Date': item.created_at ? new Date(item.created_at).toLocaleDateString() : '',
        }));
        filename = `compliance-export-${new Date().toISOString().split('T')[0]}.csv`;
      }

      // Convert to CSV using PapaParse
      const csv = Papa.unparse(csvData, {
        quotes: true,
        quoteChar: '"',
        escapeChar: '"',
        delimiter: ',',
        header: true,
        newline: '\r\n',
        skipEmptyLines: true,
      });

      // Create and trigger download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  // PDF Export Function
  const exportToPDF = async () => {
    try {
      setIsExporting(true);
      setExportType('pdf');

      // Call Supabase Edge Function to generate PDF
      const response = await fetch('/functions/v1/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType: dataType,
          orgId: orgId,
          data: data.slice(0, 100), // Limit data to prevent large payloads
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get PDF blob
      const blob = await response.blob();
      
      // Create and trigger download
      const filename = `${dataType}-report-${new Date().toISOString().split('T')[0]}.pdf`;
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting} className={className}>
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV} disabled={isExporting}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={exportToPDF} disabled={isExporting}>
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
