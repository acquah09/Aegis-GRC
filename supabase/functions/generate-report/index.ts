// supabase/functions/generate-report/index.ts
// Supabase Edge Function for PDF report generation

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import ReactPDF from "https://esm.sh/@react-pdf/renderer@3.1.12"
import { Document, Page, Text, View, StyleSheet, Font, Table, TableCell, TableBody } from "https://esm.sh/@react-pdf/renderer@3.1.12"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'semibold',
    color: '#374151',
  },
  section: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
  },
  headerCell: {
    fontSize: 12,
    color: '#6b7280',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
    padding: 8,
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 10,
    color: '#374151',
    flex: 1,
  },
  statusCell: {
    fontSize: 9,
    color: '#FFFFFF',
    backgroundColor: '#6b7280',
    padding: 2,
    borderRadius: 2,
    textAlign: 'center',
  },
  compliantStatus: {
    backgroundColor: '#10b981',
  },
  inProgressStatus: {
    backgroundColor: '#f59e0b',
  },
  notStartedStatus: {
    backgroundColor: '#ef4444',
  },
  notApplicableStatus: {
    backgroundColor: '#6b7280',
  },
  riskScoreCell: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 2,
    borderRadius: 2,
    color: '#FFFFFF',
  },
  lowRisk: {
    backgroundColor: '#10b981',
  },
  mediumRisk: {
    backgroundColor: '#f59e0b',
  },
  highRisk: {
    backgroundColor: '#f97316',
  },
  criticalRisk: {
    backgroundColor: '#ef4444',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'center',
  },
})

// Risk Report Document
function RiskReportDocument({ data, orgName }: { data: any[], orgName: string }) {
  // Calculate statistics
  const totalRisks = data.length;
  const criticalRisks = data.filter(r => r.risk_score >= 15).length;
  const highRisks = data.filter(r => r.risk_score >= 10 && r.risk_score < 15).length;
  const mediumRisks = data.filter(r => r.risk_score >= 5 && r.risk_score < 10).length;
  const lowRisks = data.filter(r => r.risk_score < 5).length;

  const getRiskScoreColor = (score: number) => {
    if (score <= 4) return styles.lowRisk;
    if (score <= 9) return styles.mediumRisk;
    if (score <= 14) return styles.highRisk;
    return styles.criticalRisk;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return styles.compliantStatus;
      case 'in-progress': return styles.inProgressStatus;
      case 'not-started': return styles.notStartedStatus;
      case 'not-applicable': return styles.notApplicableStatus;
      default: return styles.notApplicableStatus;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Generated: {new Date().toLocaleDateString()}</Text>
          <Text style={styles.headerCell}>Page 1</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Risk Register Report</Text>
        <Text style={styles.subtitle}>{orgName}</Text>

        {/* Executive Summary */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Executive Summary</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <View>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Total Risks</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937' }}>{totalRisks}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Critical Risks</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ef4444' }}>{criticalRisks}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>High Risks</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#f97316' }}>{highRisks}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Medium/Low Risks</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#10b981' }}>{mediumRisks + lowRisks}</Text>
            </View>
          </View>
        </View>

        {/* Risk Details Table */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Risk Details</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Title</Text>
              <Text style={styles.tableCell}>Category</Text>
              <Text style={styles.tableCell}>Score</Text>
              <Text style={styles.tableCell}>Status</Text>
              <Text style={styles.tableCell}>Owner</Text>
            </View>
            
            {/* Table Body */}
            {data.slice(0, 20).map((risk, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{risk.title?.substring(0, 50) || ''}</Text>
                <Text style={styles.tableCell}>{risk.category || ''}</Text>
                <View style={[styles.tableCell, styles.riskScoreCell, getRiskScoreColor(risk.risk_score || 0)]}>
                  <Text>{risk.risk_score || 0}</Text>
                </View>
                <View style={[styles.statusCell, getStatusColor(risk.status || '')]}>
                  <Text>{risk.status || 'Unknown'}</Text>
                </View>
                <Text style={styles.tableCell}>{risk.owner_name || 'Unassigned'}</Text>
              </View>
            ))}
          </View>
          
          {data.length > 20 && (
            <Text style={{ fontSize: 10, color: '#6b7280', textAlign: 'center', marginTop: 10 }}>
              Showing 20 of {data.length} risks
            </Text>
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generated by Aegis GRC - Risk Management Platform
        </Text>
      </Page>
    </Document>
  )
}

// Compliance Report Document
function ComplianceReportDocument({ data, orgName }: { data: any[], orgName: string }) {
  // Calculate statistics
  const totalControls = data.length;
  const compliantControls = data.filter(item => item.status === 'compliant').length;
  const inProgressControls = data.filter(item => item.status === 'in-progress').length;
  const notStartedControls = data.filter(item => item.status === 'not-started').length;
  const notApplicableControls = data.filter(item => item.status === 'not-applicable').length;
  
  const complianceScore = totalControls > 0 ? Math.round((compliantControls / totalControls) * 100) : 0;

  // Group by category
  const categoryStats = data.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = { total: 0, compliant: 0 };
    }
    acc[category].total++;
    if (item.status === 'compliant') {
      acc[category].compliant++;
    }
    return acc;
  }, {} as Record<string, { total: number; compliant: number }>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return styles.compliantStatus;
      case 'in-progress': return styles.inProgressStatus;
      case 'not-started': return styles.notStartedStatus;
      case 'not-applicable': return styles.notApplicableStatus;
      default: return styles.notApplicableStatus;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Generated: {new Date().toLocaleDateString()}</Text>
          <Text style={styles.headerCell}>Page 1</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Compliance Report</Text>
        <Text style={styles.subtitle}>{orgName}</Text>

        {/* Executive Summary */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Executive Summary</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <View>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Total Controls</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937' }}>{totalControls}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Compliance Score</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#10b981' }}>{complianceScore}%</Text>
            </View>
            <View>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Compliant</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#10b981' }}>{compliantControls}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>In Progress</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#f59e0b' }}>{inProgressControls}</Text>
            </View>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Compliance by Category</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Category</Text>
              <Text style={styles.tableCell}>Total</Text>
              <Text style={styles.tableCell}>Compliant</Text>
              <Text style={styles.tableCell}>Score %</Text>
            </View>
            
            {Object.entries(categoryStats).map(([category, stats], index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{category}</Text>
                <Text style={styles.tableCell}>{stats.total}</Text>
                <Text style={styles.tableCell}>{stats.compliant}</Text>
                <Text style={styles.tableCell}>
                  {stats.total > 0 ? Math.round((stats.compliant / stats.total) * 100) : 0}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Compliance Details Table */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Control Details</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Control Ref</Text>
              <Text style={styles.tableCell}>Title</Text>
              <Text style={styles.tableCell}>Category</Text>
              <Text style={styles.tableCell}>Status</Text>
              <Text style={styles.tableCell}>Assigned To</Text>
            </View>
            
            {/* Table Body */}
            {data.slice(0, 20).map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.control_ref || ''}</Text>
                <Text style={styles.tableCell}>{item.title?.substring(0, 40) || ''}</Text>
                <Text style={styles.tableCell}>{item.category || ''}</Text>
                <View style={[styles.statusCell, getStatusColor(item.status || '')]}>
                  <Text>{item.status || 'Unknown'}</Text>
                </View>
                <Text style={styles.tableCell}>{item.assigned_to_name || 'Unassigned'}</Text>
              </View>
            ))}
          </View>
          
          {data.length > 20 && (
            <Text style={{ fontSize: 10, color: '#6b7280', textAlign: 'center', marginTop: 10 }}>
              Showing 20 of {data.length} controls
            </Text>
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generated by Aegis GRC - Compliance Management Platform
        </Text>
      </Page>
    </Document>
  )
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { reportType, orgId, data } = await req.json()

    if (!reportType || !orgId) {
      return new Response(
        JSON.stringify({ error: 'Report type and orgId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get organization name
    const { data: orgData } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', orgId)
      .single()

    const orgName = orgData?.name || 'Unknown Organization'

    // Generate PDF based on report type
    let pdfDoc;
    
    if (reportType === 'risks') {
      pdfDoc = <RiskReportDocument data={data} orgName={orgName} />
    } else if (reportType === 'compliance') {
      pdfDoc = <ComplianceReportDocument data={data} orgName={orgName} />
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid report type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate PDF
    const pdfBytes = await ReactPDF.render(pdfDoc)
    
    // Return PDF as blob
    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
