// src/lib/seeds/iso27001-2022.ts
// ISO/IEC 27001:2022 framework seed data with all 93 controls

export interface ISOControl {
  control_ref: string;
  title: string;
  theme: string;
  description: string;
  status: 'not-started';
  notes: string;
}

export const ISO27001_2022_CONTROLS: ISOControl[] = [
  // Organisational controls (37 controls)
  {
    control_ref: '5.1',
    title: 'Policies for information security',
    theme: 'Organisational controls',
    description: 'Policies for information security shall be defined, approved by management, reviewed and communicated, and supported by relevant documentation.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.2',
    title: 'Information security roles and responsibilities',
    theme: 'Organisational controls',
    description: 'All information security responsibilities and roles shall be defined and allocated.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.3',
    title: 'Segregation of duties',
    theme: 'Organisational controls',
    description: 'Conflicting duties and conflicting areas of responsibility shall be segregated.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.4',
    title: 'Management responsibilities',
    theme: 'Organisational controls',
    description: 'Management shall require all personnel to apply information security in accordance with the established information security policy, information security topics, information security roles and responsibilities.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.5',
    title: 'Contact with authorities',
    theme: 'Organisational controls',
    description: 'Contact with relevant authorities shall be maintained.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.6',
    title: 'Contact with special interest groups',
    theme: 'Organisational controls',
    description: 'Contact with special interest groups or other specialist security forums and professional associations shall be maintained.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.7',
    title: 'Threat intelligence',
    theme: 'Organisational controls',
    description: 'Threat intelligence shall be obtained and used to assess the nature and source of threats targeting the organization.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.8',
    title: 'Information security in project management',
    theme: 'Organisational controls',
    description: 'Information security shall be integrated into project management, regardless of the type of project.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.9',
    title: 'Inventory of information and other associated assets',
    theme: 'Organisational controls',
    description: 'Assets associated with information and the processing of information shall be identified and an inventory of these assets shall be maintained.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.10',
    title: 'Acceptable use of information and other associated assets',
    theme: 'Organisational controls',
    description: 'Rules for the acceptable use of information and of other associated assets shall be identified, documented and implemented.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.11',
    title: 'Return of assets',
    theme: 'Organisational controls',
    description: 'All personnel and other interested parties shall return all of the organization\'s assets in their possession upon termination of their employment, contract or agreement.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.12',
    title: 'Classification of information',
    theme: 'Organisational controls',
    description: 'Information shall be classified in terms of legal requirements, value, criticality and sensitivity to unauthorized disclosure or modification.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.13',
    title: 'Labelling of information',
    theme: 'Organisational controls',
    description: 'Information shall be labelled in terms of information classification in accordance with the classification scheme developed by the organization.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.14',
    title: 'Information transfer',
    theme: 'Organisational controls',
    description: 'Information transfer rules, procedures, agreements and standards shall be in place for all types of information transfer facilities.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.15',
    title: 'Access control',
    theme: 'Organisational controls',
    description: 'Access to information and other associated assets shall be limited on the basis of business requirements and access control policy.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.16',
    title: 'Identity management',
    theme: 'Organisational controls',
    description: 'The full life cycle of identities shall be managed.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.17',
    title: 'Authentication information',
    theme: 'Organisational controls',
    description: 'Authentication information shall be managed to protect the confidentiality, integrity and availability of information.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.18',
    title: 'Access rights',
    theme: 'Organisational controls',
    description: 'Access rights shall be managed throughout the life cycle of access rights.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.19',
    title: 'Information security in supplier relationships',
    theme: 'Organisational controls',
    description: 'Processes and procedures shall be defined and implemented to manage the information security risks associated with the supplier\'s products, services and activities.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.20',
    title: 'Addressing information security within supplier agreements',
    theme: 'Organisational controls',
    description: 'Relevant information security requirements, risks and controls shall be established and agreed with each supplier.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.21',
    title: 'Managing information security in the ICT supply chain',
    theme: 'Organisational controls',
    description: 'Agreements with suppliers shall include requirements to address information security risks associated with information and communications technology (ICT) products and services supply chain.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.22',
    title: 'Monitoring, review and change management of supplier services',
    theme: 'Organisational controls',
    description: 'The organization shall regularly monitor, review, audit and evaluate supplier services and their performance.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.23',
    title: 'Information security for use of cloud services',
    theme: 'Organisational controls',
    description: 'Processes for the acquisition, use, management and exit from cloud services shall be established in accordance with the organization\'s information security requirements.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.24',
    title: 'Information security incident management planning and preparation',
    theme: 'Organisational controls',
    description: 'The organization shall plan and prepare for the management of information security incidents.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.25',
    title: 'Assessment and decision on information security events',
    theme: 'Organisational controls',
    description: 'Information security events shall be assessed and it shall be decided whether they are to be categorized as information security incidents.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.26',
    title: 'Response to information security incidents',
    theme: 'Organisational controls',
    description: 'Information security incidents shall be responded to in accordance with the documented incident management procedures.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.27',
    title: 'Learning from information security incidents',
    theme: 'Organisational controls',
    description: 'Knowledge gained from information security incidents shall be used to reduce the likelihood or impact of future incidents.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.28',
    title: 'Collection of evidence',
    theme: 'Organisational controls',
    description: 'The organization shall determine and collect evidence related to information security incidents in accordance with legal requirements and the organization\'s guidelines.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.29',
    title: 'Information security during disruption',
    theme: 'Organisational controls',
    description: 'Information security shall be maintained during disruption.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.30',
    title: 'ICT readiness for business continuity',
    theme: 'Organisational controls',
    description: 'ICT facilities needed for the operation of business continuity plans shall be available and ready for use within the time required by the business continuity plan.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.31',
    title: 'Legal statutory regulatory and contractual requirements',
    theme: 'Organisational controls',
    description: 'All relevant legal, statutory, regulatory and contractual requirements for information security and the approach to meet these requirements shall be identified, documented and kept up to date.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.32',
    title: 'Intellectual property rights',
    theme: 'Organisational controls',
    description: 'Procedures shall be implemented to ensure intellectual property rights are protected.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.33',
    title: 'Protection of records',
    theme: 'Organisational controls',
    description: 'Records shall be protected from loss, destruction, falsification, unauthorized access and unauthorized release.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.34',
    title: 'Privacy and protection of PII',
    theme: 'Organisational controls',
    description: 'The organization shall identify and meet all requirements related to privacy and protection of personally identifiable information (PII).',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.35',
    title: 'Independent review of information security',
    theme: 'Organisational controls',
    description: 'The organization\'s approach to managing information security and its implementation shall be reviewed independently at planned intervals or when significant changes occur.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.36',
    title: 'Compliance with policies rules and standards for information security',
    theme: 'Organisational controls',
    description: 'Compliance with the information security policies, topic-specific policies, rules and standards shall be regularly reviewed.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '5.37',
    title: 'Documented operating procedures',
    theme: 'Organisational controls',
    description: 'Information security tasks and activities shall be documented and made available to all personnel who need them.',
    status: 'not-started',
    notes: ''
  },

  // People controls (8 controls)
  {
    control_ref: '6.1',
    title: 'Screening',
    theme: 'People controls',
    description: 'Background verification checks on all candidates to be considered for employment shall be carried out in accordance with relevant laws, regulations and ethics, and proportional to the business requirements, classification of the information and perceived risks.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '6.2',
    title: 'Terms and conditions of employment',
    theme: 'People controls',
    description: 'The organization\'s information security responsibilities shall be defined and documented in the terms and conditions of employment.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '6.3',
    title: 'Information security awareness education and training',
    theme: 'People controls',
    description: 'All personnel of the organization and, where relevant, contractors shall receive appropriate information security awareness education and training and regular updates in accordance with their roles and responsibilities.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '6.4',
    title: 'Disciplinary process',
    theme: 'People controls',
    description: 'A disciplinary process shall be established and formalized to take action against personnel and other interested parties who have committed an information security policy breach.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '6.5',
    title: 'Responsibilities after termination or change of employment',
    theme: 'People controls',
    description: 'Information security responsibilities and duties that continue after termination or change of employment shall be defined, documented and communicated to the person or entity concerned.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '6.6',
    title: 'Confidentiality or non-disclosure agreements',
    theme: 'People controls',
    description: 'Requirements for confidentiality or non-disclosure agreements reflecting the organization\'s information security needs shall be identified, documented and periodically reviewed.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '6.7',
    title: 'Remote working',
    theme: 'People controls',
    description: 'Security measures shall be implemented when personnel work remotely to protect information accessed, processed or stored outside the organization\'s premises.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '6.8',
    title: 'Information security event reporting',
    theme: 'People controls',
    description: 'All personnel of the organization and, where relevant, contractors shall be required to report information security events in a timely manner to the designated point of contact.',
    status: 'not-started',
    notes: ''
  },

  // Physical controls (14 controls)
  {
    control_ref: '7.1',
    title: 'Physical security perimeters',
    theme: 'Physical controls',
    description: 'Physical security perimeters shall be defined and used to protect areas that contain information and other associated assets.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '7.2',
    title: 'Physical entry',
    theme: 'Physical controls',
    description: 'Secure areas shall be protected by appropriate entry controls to ensure that only authorized personnel are allowed access.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '7.3',
    title: 'Securing offices rooms and facilities',
    theme: 'Physical controls',
    description: 'Physical security for offices, rooms and facilities shall be designed and implemented.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '7.4',
    title: 'Physical security monitoring',
    theme: 'Physical controls',
    description: 'Physical security monitoring shall be implemented to detect and prevent unauthorized physical access to secure areas.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '7.5',
    title: 'Protecting against physical and environmental threats',
    theme: 'Physical controls',
    description: 'Protection against physical and environmental threats shall be designed and implemented.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '7.6',
    title: 'Working in secure areas',
    theme: 'Physical controls',
    description: 'Physical security procedures for secure areas shall be developed and implemented.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '7.7',
    title: 'Clear desk and clear screen',
    theme: 'Physical controls',
    description: 'A clear desk and clear screen policy for information and other associated assets shall be adopted and implemented.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '7.8',
    title: 'Equipment siting and protection',
    theme: 'Physical controls',
    description: 'Equipment shall be sited or protected to reduce the risks from environmental threats and hazards, and opportunities for unauthorized access.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '7.9',
    title: 'Security of assets off-premises',
    theme: 'Physical controls',
    description: 'Assets situated off-premises shall be protected against physical and environmental threats.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '7.10',
    title: 'Storage media',
    theme: 'Physical controls',
    description: 'Storage media shall be managed through their life cycle in accordance with the organization\'s information security requirements.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '7.11',
    title: 'Supporting utilities',
    theme: 'Physical controls',
    description: 'Supporting utilities shall be protected from power failures and other disruptions.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '7.12',
    title: 'Cabling security',
    theme: 'Physical controls',
    description: 'Power and data cabling carrying information or supporting information services shall be protected against interception or damage.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '7.13',
    title: 'Equipment maintenance',
    theme: 'Physical controls',
    description: 'Equipment shall be maintained in accordance with manufacturer recommendations and organizational requirements.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '7.14',
    title: 'Secure disposal or re-use of equipment',
    theme: 'Physical controls',
    description: 'Items of equipment containing storage media shall be verified to ensure that any sensitive data and licensed software has been removed or securely overwritten prior to disposal or re-use.',
    status: 'not-started',
    notes: ''
  },

  // Technological controls (34 controls)
  {
    control_ref: '8.1',
    title: 'User endpoint devices',
    theme: 'Technological controls',
    description: 'Information stored on, processed by or accessible via user endpoint devices shall be protected.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.2',
    title: 'Privileged access rights',
    theme: 'Technological controls',
    description: 'The allocation and use of privileged access rights shall be restricted and controlled.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.3',
    title: 'Information access restriction',
    theme: 'Technological controls',
    description: 'Access to information and other associated assets shall be restricted in accordance with the access control policy.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.4',
    title: 'Access to source code',
    theme: 'Technological controls',
    description: 'Access to source code shall be restricted and controlled.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.5',
    title: 'Secure authentication',
    theme: 'Technological controls',
    description: 'Secure authentication technologies and processes shall be implemented based on the information access control policy.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.6',
    title: 'Capacity management',
    theme: 'Technological controls',
    description: 'The use of resources shall be monitored and adjusted in accordance with current and expected capacity requirements.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.7',
    title: 'Protection against malware',
    theme: 'Technological controls',
    description: 'Protection against malware shall be implemented and maintained.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.8',
    title: 'Management of technical vulnerabilities',
    theme: 'Technological controls',
    description: 'Technical vulnerabilities in information systems used by the organization shall be identified in a timely manner and addressed appropriately.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.9',
    title: 'Configuration management',
    theme: 'Technological controls',
    description: 'Configurations, including security configurations, of information systems used by the organization shall be documented, reviewed, managed and controlled.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.10',
    title: 'Information deletion',
    theme: 'Technological controls',
    description: 'Information stored on information systems, devices or in other storage media shall be deleted when no longer required in accordance with the organization\'s information deletion procedures.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.11',
    title: 'Data masking',
    theme: 'Technological controls',
    description: 'The use of data masking shall be considered in accordance with the organization\'s information access control policy.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.12',
    title: 'Data leakage prevention',
    theme: 'Technological controls',
    description: 'Data leakage prevention measures shall be applied to systems, networks and devices that handle information.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.13',
    title: 'Information backup',
    theme: 'Technological controls',
    description: 'Backup copies of information, software and systems shall be created and maintained in accordance with the organization\'s backup policy.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.14',
    title: 'Redundancy of information processing facilities',
    theme: 'Technological controls',
    description: 'Information processing facilities shall be implemented with redundancy sufficient to meet availability requirements.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.15',
    title: 'Logging',
    theme: 'Technological controls',
    description: 'Logs shall be produced, stored, protected and analysed to support the investigation of security incidents and legal disputes.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.16',
    title: 'Monitoring activities',
    theme: 'Technological controls',
    description: 'Networks, systems and applications shall be monitored for unusual activities and actions relevant to the implementation of the information security policy.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.17',
    title: 'Clock synchronisation',
    theme: 'Technological controls',
    description: 'The clocks of all information processing systems within an organization or security domain shall be synchronised with an accurate and reliable time source.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.18',
    title: 'Use of privileged utility programs',
    theme: 'Technological controls',
    description: 'The use of privileged utility programs shall be restricted and controlled.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.19',
    title: 'Installation of software on operational systems',
    theme: 'Technological controls',
    description: 'Procedures shall be implemented to control the installation of software on operational systems.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.20',
    title: 'Networks security',
    theme: 'Technological controls',
    description: 'Networks shall be secured to protect against unauthorized access, modification or disclosure of information.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.21',
    title: 'Security of network services',
    theme: 'Technological controls',
    description: 'Security mechanisms, service levels and service requirements for all network services shall be identified and established.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.22',
    title: 'Segregation of networks',
    theme: 'Technological controls',
    description: 'Networks shall be segregated to segregate groups of information services, users or information systems.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.23',
    title: 'Web filtering',
    theme: 'Technological controls',
    description: 'Access to external websites shall be managed to reduce the exposure to malicious code.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.24',
    title: 'Use of cryptography',
    theme: 'Technological controls',
    description: 'A policy on the use of cryptographic controls shall be developed and implemented.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.25',
    title: 'Secure development life cycle',
    theme: 'Technological controls',
    description: 'Rules for the secure development of software and systems shall be established and applied.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.26',
    title: 'Application security requirements',
    theme: 'Technological controls',
    description: 'Information security requirements shall be identified, documented and verified for all application services.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.27',
    title: 'Secure system architecture and engineering principles',
    theme: 'Technological controls',
    description: 'Secure system architecture and engineering principles shall be established, documented, maintained and applied to all information system development activities.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.28',
    title: 'Secure coding',
    theme: 'Technological controls',
    description: 'Secure coding principles shall be applied to all development processes.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.29',
    title: 'Security testing in development and acceptance',
    theme: 'Technological controls',
    description: 'Security testing shall be performed during the development and acceptance of information systems.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.30',
    title: 'Outsourced development',
    theme: 'Technological controls',
    description: 'The organization shall supervise and monitor the information security activities of outsourced development.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.31',
    title: 'Separation of development test and production environments',
    theme: 'Technological controls',
    description: 'Development, testing and production environments shall be separated.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.32',
    title: 'Change management',
    theme: 'Technological controls',
    description: 'Changes to information systems and services shall be managed in a controlled and secure manner.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.33',
    title: 'Test information',
    theme: 'Technological controls',
    description: 'Test information shall be protected and controlled.',
    status: 'not-started',
    notes: ''
  },
  {
    control_ref: '8.34',
    title: 'Protection of information systems during audit testing',
    theme: 'Technological controls',
    description: 'Audit tests and other assurance activities involving information systems shall be planned and controlled to minimize disruption to business operations.',
    status: 'not-started',
    notes: ''
  }
];

export const ISO27001_2022_FRAMEWORK = {
  name: 'ISO/IEC 27001:2022',
  version: '2022',
  description: 'Information security management systems standard covering 93 controls across 4 themes'
};
