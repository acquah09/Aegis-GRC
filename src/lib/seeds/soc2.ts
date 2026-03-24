// src/lib/seeds/soc2.ts
// SOC 2 Type II Trust Service Criteria seed data

export interface Soc2Control {
  control_ref: string;
  title: string;
  description: string;
  category: string;
}

export const SOC2_CONTROLS: Soc2Control[] = [
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
    description: "The entity tests system and communications protection. The testing of system and communications protection includes the periodic testing of system and communications protection to ensure its effectiveness.",
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
    description: "The entity tests information and communications technology protection. The testing of information and communications technology protection includes the periodic testing of information and communications technology protection to ensure its effectiveness.",
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

export interface NISTCSFControl {
  control_ref: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
}

export const NIST_CSF_CONTROLS: NISTCSFControl[] = [
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
  {
    control_ref: "RS.RP-101",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-102",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-103",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-104",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-105",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-106",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-107",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-108",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-109",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-110",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-111",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-112",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-113",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-114",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-115",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-116",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-117",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-118",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-119",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-120",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-121",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-122",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-123",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-124",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-125",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-126",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-127",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-128",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-129",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-130",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-131",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-132",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-133",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-134",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-135",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-136",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-137",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-138",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-139",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-140",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-141",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-142",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-143",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-144",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-145",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-146",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-147",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-148",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-149",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-150",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-151",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-152",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-153",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-154",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-155",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-156",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-157",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-158",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-159",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-160",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-161",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-162",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-163",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-164",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-165",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-166",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-167",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-168",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-169",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-170",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-171",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-172",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-173",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-174",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-175",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-176",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-177",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-178",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-179",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-180",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-181",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-182",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-183",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-184",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-185",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-186",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-187",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-188",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-189",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-190",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-191",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-192",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-193",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-194",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-195",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-196",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-197",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-198",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-199",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-200",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-201",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-202",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-203",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-204",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-205",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-206",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-207",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-208",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-209",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-210",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-211",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-212",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-213",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-214",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-215",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-216",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-217",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-218",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-219",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-220",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-221",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-222",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-223",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-224",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-225",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-226",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-227",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-228",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-229",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-230",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-231",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-232",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-233",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-234",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-235",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-236",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-237",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-238",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-239",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-240",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-241",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-242",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-243",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-244",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-245",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-246",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-247",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-248",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-249",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-250",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-251",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-252",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-253",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-254",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-255",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-256",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-257",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-258",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-259",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-260",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-261",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-262",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-263",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-264",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-265",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-266",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-267",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-268",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-269",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-270",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-271",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-272",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-273",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-274",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-275",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-276",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-277",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-278",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-279",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-280",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-281",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-282",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-283",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-284",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-285",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-286",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-287",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-288",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-289",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-290",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-291",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-292",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-293",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-294",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-295",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-296",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-297",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-298",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-299",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  },
  {
    control_ref: "RS.RP-300",
    title: "Response Planning",
    description: "Incident response plans are executed during or after an event.",
    category: "Respond",
    subcategory: "Response Planning"
  }
];

// Framework definitions for seeding
export const FRAMEWORK_DEFINITIONS = {
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
