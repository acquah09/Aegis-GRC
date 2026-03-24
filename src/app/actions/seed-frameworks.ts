// src/app/actions/seed-frameworks.ts
// Server action to seed ISO 27001:2022 framework

'use server';

import { createClient } from '@/lib/supabase/server';
import { ISO27001_2022_FRAMEWORK, ISO27001_2022_CONTROLS } from '@/lib/seeds/iso27001-2022';

export async function seedISO27001Framework() {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    // Get user's organization
    const { data: profile } = await supabase
      .from('profiles')
      .select('org_id')
      .eq('id', session.user.id)
      .single();

    if (!profile?.org_id) {
      return { success: false, error: 'User organization not found' };
    }

    // Check if framework already exists
    const { data: existingFramework } = await supabase
      .from('frameworks')
      .select('id')
      .eq('name', ISO27001_2022_FRAMEWORK.name)
      .eq('org_id', profile.org_id)
      .maybeSingle();

    if (existingFramework) {
      return { success: false, error: 'ISO/IEC 27001:2022 framework already exists' };
    }

    // Insert the framework
    const { data: framework, error: frameworkError } = await supabase
      .from('frameworks')
      .insert({
        name: ISO27001_2022_FRAMEWORK.name,
        version: ISO27001_2022_FRAMEWORK.version,
        description: ISO27001_2022_FRAMEWORK.description,
        org_id: profile.org_id,
        created_by: session.user.id,
      })
      .select()
      .single();

    if (frameworkError) {
      console.error('Framework insertion error:', frameworkError);
      return { success: false, error: 'Failed to create framework' };
    }

    if (!framework) {
      return { success: false, error: 'Failed to create framework - no data returned' };
    }

    // Insert all compliance items
    const complianceItems = ISO27001_2022_CONTROLS.map(control => ({
      framework_id: framework.id,
      control_ref: control.control_ref,
      title: control.title,
      description: control.description,
      theme: control.theme,
      status: control.status,
      notes: control.notes,
      org_id: profile.org_id,
    }));

    const { error: itemsError } = await supabase
      .from('compliance_items')
      .insert(complianceItems);

    if (itemsError) {
      console.error('Compliance items insertion error:', itemsError);
      // Clean up the framework if items failed to insert
      await supabase.from('frameworks').delete().eq('id', framework.id);
      return { success: false, error: 'Failed to create compliance items' };
    }

    return { 
      success: true, 
      count: complianceItems.length,
      frameworkId: framework.id,
      frameworkName: framework.name
    };

  } catch (error) {
    console.error('Seed framework error:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}
