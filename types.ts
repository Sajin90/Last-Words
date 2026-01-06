
export enum MessageStatus {
  DRAFT = 'DRAFT',
  LOCKED = 'LOCKED',
  AWAITING_APPROVAL = 'AWAITING_APPROVAL',
  SENT = 'SENT'
}

export enum MessageTone {
  EMOTIONAL = 'Emotional',
  FORMAL = 'Formal',
  SPIRITUAL = 'Spiritual',
  INSTRUCTIONAL = 'Instructional',
  GRATEFUL = 'Grateful'
}

export interface Approver {
  id: string;
  name: string;
  email: string;
  phone: string;
  relationship: string;
  status: 'PENDING' | 'CONFIRMED';
}

export interface Message {
  id: string;
  title: string;
  recipientName: string;
  recipientEmail: string;
  content: string;
  status: MessageStatus;
  tone: MessageTone;
  createdAt: number;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  emergencyInstructions?: string;
  approvers: Approver[];
}
