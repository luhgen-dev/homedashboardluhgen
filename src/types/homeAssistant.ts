export type HAEntityDomain = 
  | 'climate' 
  | 'media_player' 
  | 'light' 
  | 'switch' 
  | 'fan' 
  | 'cover' 
  | 'lock' 
  | 'sensor' 
  | 'binary_sensor' 
  | 'weather';

export interface HAEntityState {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed?: string;
  last_updated?: string;
}

export interface ZoneDefinition {
  id: string;
  name: string;
  subtitle: string;
  iconName: string;
  entityIds: string[];
}

export interface HAConnectionConfig {
  url: string;
  token: string;
  connected: boolean;
  isDemo: boolean;
}
