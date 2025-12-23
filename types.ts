
export type TherapyModality = 
  | 'CBT' 
  | 'DBT' 
  | 'ACT' 
  | 'SFT' 
  | 'Psychodynamic' 
  | 'Humanistic' 
  | 'Custom';

export type FieldType = 'text' | 'textarea' | 'checkbox' | 'scale' | 'checklist';

export interface WorksheetField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[]; // For checklists
  value?: string | string[] | boolean | number;
}

export interface WorksheetSection {
  id: string;
  title: string;
  description?: string;
  fields: WorksheetField[];
}

export interface Worksheet {
  id: string;
  title: string;
  modality: TherapyModality;
  focus: string;
  introduction: string;
  sections: WorksheetSection[];
  footer?: string;
}
