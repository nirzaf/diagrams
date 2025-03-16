// types.ts
export interface TCPIPLayerInfo {
  name: string;
  description: string;
  protocols: string[];
  responsibilities: string[];
}

export interface ProtocolFeature {
  feature: string;
  tcpValue: number | string;
  udpValue: number | string;
  description: string;
}

export interface PageNode {
  id: string;
  type: 'home' | 'detail' | 'ranking' | 'service' | 'login';
  data: {
    label: string;
    description: string;
    functionality: string[];
  };
  position: { x: number; y: number };
}

export interface PageConnection {
  id: string;
  source: string;
  target: string;
  label: string;
  type?: 'GET' | 'POST';
  data?: Record<string, unknown>;
}

export type StepType = 'start' | 'process' | 'decision' | 'data' | 'end';

export interface WorkflowStep {
  id: string;
  type: StepType;
  label: string;
  description: string;
  nextSteps?: string[];
  condition?: string;
}

export interface ClassField {
  name: string;
  dataType: string;
  description: string;
  examples: string[];
}

export type ClassType = 'Actor' | 'Movie' | 'User' | 'UserReview' | 'ExternalReview';

export interface ClassFields {
  [key: string]: ClassField[];
}

export type ViewType = 'masterPage' | 'navigation' | 'movieDetail' | 'rankingView';
export type DeviceType = 'mobile' | 'desktop';

export interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
}