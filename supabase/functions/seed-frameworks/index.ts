// supabase/functions/seed-frameworks/index.ts
// Supabase Edge Function to seed frameworks and compliance items

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Import seed data (in a real implementation, this would be from your seed files)
const SOC2_CONTROLS = [
  // Common Criteria 1-9
  {
    control_ref: "CC1.1",
    title: "Inventory of Information Assets",
    description: "The entity inventories information assets. The inventory of information assets includes all information assets that are used in the operation of the service and that are processed, stored, or transmitted by the service organization.",
    category: "Security"
  },
  {
    control_ref: "CC1.2",
    title: "Classification of Information Assets",
    description: "The entity classifies information assets. The classification of information assets includes the classification of information and information assets processed, stored, or transmitted by the service organization based on information sensitivity.",
    category: "Security"
  },
  {
    control_ref: "CC2.1",
    title: "Access Control Policy",
    description: "The entity implements access control software and infrastructure. Access control software and infrastructure include tools, applications, and infrastructure that control access to information assets.",
    category: "Security"
  },
  {
    control_ref: "CC2.2",
    title: "Access Control Procedures",
    description: "The entity implements logical and physical access control software and infrastructure. Logical and physical access control software and infrastructure include tools, applications, and infrastructure that control access to information assets.",
    category: "Security"
  },
  {
    control_ref: "CC2.3",
    title: "Access Control Review",
    description: "The entity reviews access rights periodically. The review of access rights includes the periodic review of access rights for all users, including privileged users, and the removal of access rights when no longer needed.",
    category: "Security"
  },
  {
    control_ref: "CC3.1",
    title: "Risk Assessment Process",
    description: "The entity identifies and assesses risks that may affect the achievement of the entity's objectives. The risk assessment process includes the identification and assessment of risks that may affect the achievement of the entity's objectives.",
    category: "Security"
  },
  {
    control_ref: "CC3.2",
    title: "Risk Mitigation",
    description: "The entity implements risk mitigation strategies. Risk mitigation strategies include the implementation of controls to address identified risks.",
    category: "Security"
  },
  {
    control_ref: "CC4.1",
    title: "Monitoring Controls",
    description: "The entity implements monitoring controls. Monitoring controls include the implementation of controls to monitor the effectiveness of other controls.",
    category: "Security"
  },
  {
    control_ref: "CC4.2",
    title: "System Performance Monitoring",
    description: "The entity monitors system performance. System performance monitoring includes the monitoring of system performance to ensure that system performance meets the requirements of the service.",
    category: "Security"
  },
  {
    control_ref: "CC5.1",
    title: "Incident Response Plan",
    description: "The entity implements an incident response plan. The incident response plan includes the implementation of procedures to respond to security incidents.",
    category: "Security"
  },
  {
    control_ref: "CC5.2",
    title: "Incident Response Testing",
    description: "The entity tests the incident response plan. The testing of the incident response plan includes the periodic testing of the incident response plan to ensure its effectiveness.",
    category: "Security"
  },
  {
    control_ref: "CC6.1",
    title: "Availability Controls",
    description: "The entity implements availability controls. Availability controls include the implementation of controls to ensure the availability of the service.",
    category: "Availability"
  },
  {
    control_ref: "CC6.2",
    title: "Availability Monitoring",
    description: "The entity monitors availability. The monitoring of availability includes the monitoring of service availability to ensure that service availability meets the requirements of the service.",
    category: "Availability"
  },
  {
    control_ref: "CC6.3",
    title: "Availability Testing",
    description: "The entity tests availability controls. The testing of availability controls includes the periodic testing of availability controls to ensure their effectiveness.",
    category: "Availability"
  },
  {
    control_ref: "CC6.4",
    title: "Availability Incident Response",
    description: "The entity implements availability incident response procedures. Availability incident response procedures include the implementation of procedures to respond to availability incidents.",
    category: "Availability"
  },
  {
    control_ref: "CC6.5",
    title: "Availability Incident Response Testing",
    description: "The entity tests availability incident response procedures. The testing of availability incident response procedures includes the periodic testing of availability incident response procedures to ensure their effectiveness.",
    category: "Availability"
  },
  {
    control_ref: "CC6.6",
    title: "Availability Incident Response Documentation",
    description: "The entity documents availability incidents. The documentation of availability incidents includes the documentation of availability incidents to ensure that availability incidents are properly documented.",
    category: "Availability"
  },
  {
    control_ref: "CC6.7",
    title: "Availability Incident Response Communication",
    description: "The entity communicates availability incidents. The communication of availability incidents includes the communication of availability incidents to ensure that availability incidents are properly communicated.",
    category: "Availability"
  },
  {
    control_ref: "CC6.8",
    title: "Availability Incident Response Review",
    description: "The entity reviews availability incidents. The review of availability incidents includes the periodic review of availability incidents to ensure that availability incidents are properly reviewed.",
    category: "Availability"
  },
  {
    control_ref: "CC7.1",
    title: "Change Management Process",
    description: "The entity implements a change management process. The change management process includes the implementation of procedures to manage changes to the service.",
    category: "Security"
  },
  {
    control_ref: "CC7.2",
    title: "Change Management Testing",
    description: "The entity tests the change management process. The testing of the change management process includes the periodic testing of the change management process to ensure its effectiveness.",
    category: "Security"
  },
  {
    control_ref: "CC8.1",
    title: "System and Communications Protection",
    description: "The entity implements system and communications protection. System and communications protection includes the implementation of controls to protect systems and communications.",
    category: "Security"
  },
  {
    control_ref: "CC8.2",
    title: "System and Communications Protection Testing",
    description: "The entity tests system and communications protection. The testing of system and communications protection includes the periodic testing of system and communications protection to ensure their effectiveness.",
    category: "Security"
  },
  {
    control_ref: "CC9.1",
    title: "Information and Communications Technology Protection",
    description: "The entity implements information and communications technology protection. Information and communications technology protection includes the implementation of controls to protect information and communications technology.",
    category: "Security"
  },
  {
    control_ref: "CC9.2",
    title: "Information and Communications Technology Protection Testing",
    description: "The entity tests information and communications technology protection. The testing of information and communications technology protection includes the periodic testing of information and communications technology protection to ensure their effectiveness.",
    category: "Security"
  },

  // Additional Criteria
  {
    control_ref: "A1.1",
    title: "Risk Assessment and Treatment",
    description: "The entity identifies and assesses risks that may affect the achievement of its objectives and implements risk mitigation strategies.",
    category: "Security"
  },

  // Confidentiality Criteria
  {
    control_ref: "C1.1",
    title: "Encryption and Decryption",
    description: "The entity implements encryption and decryption. Encryption and decryption include the implementation of controls to protect information through encryption and decryption.",
    category: "Security"
  },

  // Privacy Criteria
  {
    control_ref: "PI1.1",
    title: "Privacy Notice",
    description: "The entity provides a privacy notice. The privacy notice includes the provision of a privacy notice to inform individuals about the entity's privacy practices.",
    category: "Privacy"
  },

  // Process Integrity Criteria
  {
    control_ref: "P1.1",
    title: "Process Integrity Controls",
    description: "The entity implements process integrity controls. Process integrity controls include the implementation of controls to ensure the integrity of processes.",
    category: "Security"
  },
  {
    control_ref: "P2.1",
    title: "Process Integrity Monitoring",
    description: "The entity monitors process integrity. The monitoring of process integrity includes the monitoring of process integrity to ensure that process integrity meets the requirements of the service.",
    category: "Security"
  },
  {
    control_ref: "P3.1",
    title: "Process Integrity Testing",
    description: "The entity tests process integrity controls. The testing of process integrity controls includes the periodic testing of process integrity controls to ensure their effectiveness.",
    category: "Security"
  },
  {
    control_ref: "P4.1",
    title: "Process Integrity Incident Response",
    description: "The entity implements process integrity incident response procedures. Process integrity incident response procedures include the implementation of procedures to respond to process integrity incidents.",
    category: "Security"
  },
  {
    control_ref: "P5.1",
    title: "Process Integrity Incident Response Testing",
    description: "The entity tests process integrity incident response procedures. The testing of process integrity incident response procedures includes the periodic testing of process integrity incident response procedures to ensure their effectiveness.",
    category: "Security"
  },
  {
    control_ref: "P6.1",
    title: "Process Integrity Incident Response Documentation",
    description: "The entity documents process integrity incidents. The documentation of process integrity incidents includes the documentation of process integrity incidents to ensure that process integrity incidents are properly documented.",
    category: "Security"
  },
  {
    control_ref: "P7.1",
    title: "Process Integrity Incident Response Communication",
    description: "The entity communicates process integrity incidents. The communication of process integrity incidents includes the communication of process integrity incidents to ensure that process integrity incidents are properly communicated.",
    category: "Security"
  },
  {
    control_ref: "P8.1",
    title: "Process Integrity Incident Response Review",
    description: "The entity reviews process integrity incidents. The review of process integrity incidents includes the periodic review of process integrity incidents to ensure that process integrity incidents are properly reviewed.",
    category: "Security"
  }
];

const NIST_CSF_CONTROLS = [
  // Identify Functions
  {
    control_ref: "ID.AM-1",
    title: "Asset Management",
    description: "Physical devices and systems within the organization are inventoried and managed.",
    category: "Identify",
    subcategory: "Asset Management"
  },
  {
    control_ref: "ID.AM-2",
    title: "Asset Management",
    description: "Software platforms and applications within the organization are inventoried and managed.",
    category: "Identify",
    subcategory: "Asset Management"
  },
  {
    control_ref: "ID.AM-3",
    title: "Asset Management",
    description: "Organizational data and information are inventoried and managed.",
    category: "Identify",
    subcategory: "Asset Management"
  },
  {
    control_ref: "ID.AM-4",
    title: "Asset Management",
    description: "External information systems are inventoried and managed.",
    category: "Identify",
    subcategory: "Asset Management"
  },
  {
    control_ref: "ID.AM-5",
    title: "Asset Management",
    description: "Resources (e.g., data, hardware, software, mobile devices) are prioritized based on their classification, criticality, and value to the organization.",
    category: "Identify",
    subcategory: "Asset Management"
  },
  {
    control_ref: "ID.RA-1",
    title: "Risk Assessment",
    description: "Asset vulnerabilities are identified and documented.",
    category: "Identify",
    subcategory: "Risk Assessment"
  },
  {
    control_ref: "ID.RA-2",
    title: "Risk Assessment",
    description: "Cyber threat intelligence is gathered from internal and external sources to inform risk assessments.",
    category: "Identify",
    subcategory: "Risk Assessment"
  },
  {
    control_ref: "ID.RA-3",
    title: "Risk Assessment",
    description: "Potential business impacts to the organization are identified, analyzed, and prioritized.",
    category: "Identify",
    subcategory: "Risk Assessment"
  },
  {
    control_ref: "ID.RA-4",
    title: "Risk Assessment",
    description: "Threats, both internal and external, are identified and analyzed.",
    category: "Identify",
    subcategory: "Risk Assessment"
  },
  {
    control_ref: "ID.RA-5",
    title: "Risk Assessment",
    description: "Threat events, both intentional and unintentional, are identified and analyzed.",
    category: "Identify",
    subcategory: "Risk Assessment"
  },
  {
    control_ref: "ID.RA-6",
    title: "Risk Assessment",
    description: "Risk responses are identified, analyzed, and prioritized.",
    category: "Identify",
    subcategory: "Risk Assessment"
  },
  {
    control_ref: "ID.RA-7",
    title: "Risk Assessment",
    description: "Risk responses are tracked and monitored to ensure effectiveness and identify changes in the organizational environment.",
    category: "Identify",
    subcategory: "Risk Assessment"
  },
  {
    control_ref: "ID.SC-1",
    title: "Supply Chain Risk Management",
    description: "Cyber supply chain risk management processes are established and implemented.",
    category: "Identify",
    subcategory: "Supply Chain Risk Management"
  },
  {
    control_ref: "ID.SC-2",
    title: "Supply Chain Risk Management",
    description: "Suppliers and partners are assessed prior to establishment of the relationship.",
    category: "Identify",
    subcategory: "Supply Chain Risk Management"
  },
  {
    control_ref: "ID.SC-3",
    title: "Supply Chain Risk Management",
    description: "Suppliers and partners are monitored and assessed on an ongoing basis.",
    category: "Identify",
    subcategory: "Supply Chain Risk Management"
  },
  {
    control_ref: "ID.SC-4",
    title: "Supply Chain Risk Management",
    description: "Cyber supply chain risk management processes are coordinated with internal cybersecurity processes.",
    category: "Identify",
    subcategory: "Supply Chain Risk Management"
  },

  // Protect Functions
  {
    control_ref: "PR.AC-1",
    title: "Identity Management and Access Control",
    description: "Identities for users and devices are issued, managed, verified, revoked, and audited.",
    category: "Protect",
    subcategory: "Identity Management and Access Control"
  },
  {
    control_ref: "PR.AC-2",
    title: "Identity Management and Access Control",
    description: "Physical access to assets is managed and protected.",
    category: "Protect",
    subcategory: "Identity Management and Access Control"
  },
  {
    control_ref: "PR.AC-3",
    title: "Identity Management and Access Control",
    description: "Remote access is managed and protected.",
    category: "Protect",
    subcategory: "Identity Management and Access Control"
  },
  {
    control_ref: "PR.AC-4",
    title: "Identity Management and Access Control",
    description: "Access permissions and authorizations are managed, incorporating the principle of least privilege.",
    category: "Protect",
    subcategory: "Identity Management and Access Control"
  },
  {
    control_ref: "PR.AC-5",
    title: "Identity Management and Access Control",
    description: "Network integrity is protected (e.g., network segregation, network segmentation).",
    category: "Protect",
    subcategory: "Identity Management and Access Control"
  },
  {
    control_ref: "PR.AC-6",
    title: "Identity Management and Access Control",
    description: "Identities are proofed and bound to credentials and asserted in interactions.",
    category: "Protect",
    subcategory: "Identity Management and Access Control"
  },
  {
    control_ref: "PR.AC-7",
    title: "Identity Management and Access Control",
    description: "A system of identity management processes and technologies is implemented.",
    category: "Protect",
    subcategory: "Identity Management and Access Control"
  },
  {
    control_ref: "PR.AT-1",
    title: "Awareness and Training",
    description: "All users within the organization are made aware of their cybersecurity responsibilities.",
    category: "Protect",
    subcategory: "Awareness and Training"
  },
  {
    control_ref: "PR.AT-2",
    title: "Awareness and Training",
    description: "All personnel are trained to perform their cybersecurity-related duties and responsibilities consistent with related policies, procedures, and agreements.",
    category: "Protect",
    subcategory: "Awareness and Training"
  },
  {
    control_ref: "PR.AT-3",
    title: "Awareness and Training",
    description: "Users with significant cybersecurity responsibilities are trained to perform their duties.",
    category: "Protect",
    subcategory: "Awareness and Training"
  },
  {
    control_ref: "PR.AT-4",
    title: "Awareness and Training",
    description: "Cybersecurity knowledge is updated and shared with the community.",
    category: "Protect",
    subcategory: "Awareness and Training"
  },
  {
    control_ref: "PR.AT-5",
    title: "Awareness and Training",
    description: "Users are provided with security awareness education and are trained in their roles and responsibilities consistent with related policies, procedures, and agreements.",
    category: "Protect",
    subcategory: "Awareness and Training"
  },
  {
    control_ref: "PR.DS-1",
    title: "Data Security",
    description: "Data-at-rest is protected according to the organization's risk management strategy.",
    category: "Protect",
    subcategory: "Data Security"
  },
  {
    control_ref: "PR.DS-2",
    title: "Data Security",
    description: "Data-in-transit is protected according to the organization's risk management strategy.",
    category: "Protect",
    subcategory: "Data Security"
  },
  {
    control_ref: "PR.DS-3",
    title: "Data Security",
    description: "Data is protected against unauthorized access, use, disclosure, modification, or destruction.",
    category: "Protect",
    subcategory: "Data Security"
  },
  {
    control_ref: "PR.DS-4",
    title: "Data Security",
    description: "Data is protected against unauthorized access, use, disclosure, modification, or destruction.",
    category: "Protect",
    subcategory: "Data Security"
  },
  {
    control_ref: "PR.DS-5",
    title: "Data Security",
    description: "Data is protected against unauthorized access, use, disclosure, modification, or destruction.",
    category: "Protect",
    subcategory: "Data Security"
  },
  {
    control_ref: "PR.DS-6",
    title: "Data Security",
    description: "Data is protected against unauthorized access, use, disclosure, modification, or destruction.",
    category: "Protect",
    subcategory: "Data Security"
  },
  {
    control_ref: "PR.DS-7",
    title: "Data Security",
    description: "Data is protected against unauthorized access, use, disclosure, modification, or destruction.",
    category: "Protect",
    subcategory: "Data Security"
  },
  {
    control_ref: "PR.DS-8",
    title: "Data Security",
    description: "Data is protected against unauthorized access, use, disclosure, modification, or destruction.",
    category: "Protect",
    subcategory: "Data Security"
  },
  {
    control_ref: "PR.PT-1",
    title: "Protective Technology",
    description: "Protective technology is implemented to ensure the security and resilience of systems and assets.",
    category: "Protect",
    subcategory: "Protective Technology"
  },
  {
    control_ref: "PR.PT-2",
    title: "Protective Technology",
    description: "Protective technology is implemented to ensure the security and resilience of systems and assets.",
    category: "Protect",
    subcategory: "Protective Technology"
  },
  {
    control_ref: "PR.PT-3",
    title: "Protective Technology",
    description: "Protective technology is implemented to ensure the security and resilience of systems and assets.",
    category: "Protect",
    subcategory: "Protective Technology"
  },
  {
    control_ref: "PR.PT-4",
    title: "Protective Technology",
    description: "Protective technology is implemented to ensure the security and resilience of systems and assets.",
    category: "Protect",
    subcategory: "Protective Technology"
  },

  // Detect Functions
  {
    control_ref: "DE.CM-1",
    title: "Continuous Monitoring",
    description: "The network is monitored to detect potential cybersecurity events.",
    category: "Detect",
    subcategory: "Continuous Monitoring"
  },
  {
    control_ref: "DE.CM-2",
    title: "Continuous Monitoring",
    description: "The physical environment is monitored to detect potential cybersecurity events.",
    category: "Detect",
    subcategory: "Continuous Monitoring"
  },
  {
    control_ref: "DE.CM-3",
    title: "Continuous Monitoring",
    description: "Personnel activity is monitored to detect potential cybersecurity events.",
    category: "Detect",
    subcategory: "Continuous Monitoring"
  },
  {
    control_ref: "DE.CM-4",
    title: "Continuous Monitoring",
    description: "Malicious activity is monitored to detect potential cybersecurity events.",
    category: "Detect",
    subcategory: "Continuous Monitoring"
  },
  {
    control_ref: "DE.CM-5",
    title: "Continuous Monitoring",
    description: "External service provider activity is monitored to detect potential cybersecurity events.",
    category: "Detect",
    subcategory: "Continuous Monitoring"
  },
  {
    control_ref: "DE.CM-6",
    title: "Continuous Monitoring",
    description: "Data is monitored to detect potential cybersecurity events.",
    category: "Detect",
    subcategory: "Continuous Monitoring"
  },
  {
    control_ref: "DE.CM-7",
    title: "Continuous Monitoring",
    description: "Monitoring data is collected and analyzed from multiple sources and multiple methods.",
    category: "Detect",
    subcategory: "Continuous Monitoring"
  },
  {
    control_ref: "DE.CM-8",
    title: "Continuous Monitoring",
    description: "Monitoring data is tested for accuracy.",
    category: "Detect",
    subcategory: "Continuous Monitoring"
  },
  {
    control_ref: "DE.AE-1",
    title: "Anomalous Activity",
    description: "A baseline of network operations and expected data flows for users and systems is established and managed.",
    category: "Detect",
    subcategory: "Anomalous Activity"
  },
  {
    control_ref: "DE.AE-2",
    title: "Anomalous Activity",
    description: "Potential cybersecurity events are detected from abnormal activity or deviations from expected operations.",
    category: "Detect",
    subcategory: "Anomalous Activity"
  },
  {
    control_ref: "DE.AE-3",
    title: "Anomalous Activity",
    description: "Potential cybersecurity events are detected from abnormal activity or deviations from expected operations.",
    category: "Detect",
    subcategory: "Anomalous Activity"
  },
  {
    control_ref: "DE.AE-4",
    title: "Anomalous Activity",
    description: "Potential cybersecurity events are detected from abnormal activity or deviations from expected operations.",
    category: "Detect",
    subcategory: "Anomalous Activity"
  },
  {
    control_ref: "DE.AE-5",
    title: "Anomalous Activity",
    description: "Potential cybersecurity events are detected from abnormal activity or deviations from expected operations.",
    category: "Detect",
    subcategory: "Anomalous Activity"
  },

  // Respond Functions
  {
    control_ref: "RS.RP-1",
    title: "Response Planning",
    description: "Roles and responsibilities are coordinated through effective communication, incident response planning, and collaboration.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-2",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-3",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-4",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-5",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-6",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-7",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-8",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-9",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-10",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-11",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-12",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-13",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-14",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-15",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-16",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-17",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-18",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-19",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-20",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-21",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-22",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-23",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-24",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-25",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-26",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-27",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-28",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-29",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-30",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-31",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-32",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-33",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-34",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-35",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-36",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-37",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-38",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-39",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-40",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-41",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-42",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-43",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-44",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-45",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-46",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-47",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-48",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-49",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-50",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-51",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-52",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-53",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-54",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-55",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-56",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-57",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-58",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-59",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-60",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-61",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-62",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-63",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-64",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-65",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-66",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-67",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-68",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-69",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-70",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-71",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-72",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-73",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-74",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-75",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-76",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-77",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-78",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-79",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-80",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-81",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-82",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-83",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-84",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-85",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-86",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-87",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-88",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-89",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-90",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-91",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-92",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-93",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-94",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-95",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-96",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-97",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-98",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-99",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-100",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },

  // Recover Functions
  {
    control_ref: "RC.RP-1",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-2",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-3",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-4",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-5",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-6",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-7",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-8",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-9",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-10",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-11",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-12",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-13",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-14",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-15",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-16",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-17",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-18",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-19",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-20",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-21",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-22",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-23",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-24",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-25",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-26",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-27",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-28",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-29",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-30",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-31",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-32",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-33",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-34",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-35",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-36",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-37",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-38",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-39",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  },
  {
    control_ref: "RC.RP-40",
    title: "Recovery Planning",
    description: "Recovery plans are executed during or after an event.",
    category: "Recover",
    subcategory: "Recovery Planning"
  }
];

// Framework definitions
const FRAMEWORK_DEFINITIONS = {
  SOC2: {
    name: 'SOC 2 Type II',
    version: '2018',
    description: 'Service Organization Control 2 Type II - Security, Availability, Processing Integrity, Confidentiality, and Privacy',
    controls: SOC2_CONTROLS
  },
  NIST_CSF: {
    name: 'NIST Cybersecurity Framework',
    version: '1.1',
    description: 'National Institute of Standards and Technology Cybersecurity Framework',
    controls: NIST_CSF_CONTROLS
  }
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { framework, orgId } = await req.json()

    if (!framework || !orgId) {
      return new Response(
        JSON.stringify({ error: 'Framework and orgId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get framework definition
    const frameworkDef = FRAMEWORK_DEFINITIONS[framework as keyof typeof FRAMEWORK_DEFINITIONS]
    if (!frameworkDef) {
      return new Response(
        JSON.stringify({ error: 'Invalid framework specified' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if framework already exists for this organization
    const { data: existingFramework } = await supabase
      .from('frameworks')
      .select('id')
      .eq('org_id', orgId)
      .eq('name', frameworkDef.name)
      .eq('version', frameworkDef.version)
      .single()

    let frameworkId: string

    if (existingFramework) {
      frameworkId = existingFramework.id
      console.log(`Framework ${frameworkDef.name} already exists for org ${orgId}`)
    } else {
      // Create framework
      const { data: newFramework, error: frameworkError } = await supabase
        .from('frameworks')
        .insert({
          name: frameworkDef.name,
          version: frameworkDef.version,
          description: frameworkDef.description,
          org_id: orgId,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (frameworkError) {
        console.error('Error creating framework:', frameworkError)
        return new Response(
          JSON.stringify({ error: 'Failed to create framework', details: frameworkError }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      frameworkId = newFramework.id
      console.log(`Created framework ${frameworkDef.name} for org ${orgId}`)
    }

    // Check if compliance items already exist for this framework
    const { data: existingItems } = await supabase
      .from('compliance_items')
      .select('control_ref')
      .eq('framework_id', frameworkId)

    const existingRefs = new Set(existingItems?.map(item => item.control_ref) || [])
    const newControls = frameworkDef.controls.filter(control => !existingRefs.has(control.control_ref))

    if (newControls.length > 0) {
      // Insert compliance items in batches
      const batchSize = 50
      for (let i = 0; i < newControls.length; i += batchSize) {
        const batch = newControls.slice(i, i + batchSize)
        
        const { error: itemsError } = await supabase
          .from('compliance_items')
          .insert(
            batch.map(control => ({
              framework_id: frameworkId,
              org_id: orgId,
              control_ref: control.control_ref,
              title: control.title,
              description: control.description,
              status: 'not-started',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }))
          )

        if (itemsError) {
          console.error('Error inserting compliance items:', itemsError)
          return new Response(
            JSON.stringify({ error: 'Failed to insert compliance items', details: itemsError }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      console.log(`Inserted ${newControls.length} compliance items for framework ${frameworkDef.name}`)
    } else {
      console.log(`All compliance items already exist for framework ${frameworkDef.name}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        frameworkId,
        message: `Successfully seeded ${frameworkDef.name} framework`,
        controlsInserted: newControls.length,
        totalControls: frameworkDef.controls.length
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
