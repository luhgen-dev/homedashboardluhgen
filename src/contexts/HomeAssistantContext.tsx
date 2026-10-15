import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  createConnection, 
  createLongLivedTokenAuth, 
  subscribeEntities,
  callService as haCallService,
  Connection
} from 'home-assistant-js-websocket';
import { HAEntityState, ZoneDefinition } from '../types/homeAssistant';

export const INITIAL_ENTITIES: Record<string, HAEntityState> = {
  // Living Room Hall AC (Haier)
  'climate.living_room_hall_ac': {
    entity_id: 'climate.living_room_hall_ac',
    state: 'cool',
    attributes: {
      friendly_name: 'Hall Haier AC',
      temperature: 24,
      current_temperature: 26.5,
      min_temp: 16,
      max_temp: 30,
      target_temp_step: 1,
      hvac_modes: ['off', 'cool', 'fan_only', 'auto'],
      hvac_action: 'cooling',
      fan_mode: 'auto',
      fan_modes: ['quiet', 'low', 'medium', 'high', 'turbo', 'auto'],
      preset_mode: 'eco',
      preset_modes: ['none', 'eco', 'turbo', 'sleep']
    }
  },

  // LG TV
  'media_player.living_room_lg_tv': {
    entity_id: 'media_player.living_room_lg_tv',
    state: 'on',
    attributes: {
      friendly_name: 'LG OLED TV',
      source: 'Apple TV 4K',
      source_list: ['Apple TV 4K', 'PlayStation 5', 'Nintendo Switch', 'Live TV', 'YouTube'],
      is_volume_muted: false,
      volume_level: 0.35,
    }
  },

  // LG Soundbar S95TR
  'media_player.lg_speaker_s95tr': {
    entity_id: 'media_player.lg_speaker_s95tr',
    state: 'on',
    attributes: {
      friendly_name: 'LG Soundbar S95TR (9.1.5ch)',
      volume_level: 0.42,
      is_volume_muted: false,
      sound_mode: 'Dolby Atmos Cinema',
      sound_mode_list: ['AI Sound Pro', 'Standard', 'Cinema', 'Clear Voice Pro', 'Sports', 'Music', 'Bass Blast']
    }
  },

  // Apple TV
  'media_player.living_room_living_room': {
    entity_id: 'media_player.living_room_living_room',
    state: 'playing',
    attributes: {
      friendly_name: 'Living Room Apple TV',
      app_name: 'Apple TV+',
      media_title: 'Severance (Season 2)',
      media_artist: '4K Dolby Vision • Atmos',
      media_duration: 3240,
      media_position: 1420,
    }
  },

  // Living room vertical sheer curtain (tilt + traverse)
  'cover.living_room_vertical_curtain': {
    entity_id: 'cover.living_room_vertical_curtain',
    state: 'open',
    attributes: {
      friendly_name: 'Living Room Vertical Sheer',
      current_position: 75, // 0 = closed, 100 = fully drawn open
      current_tilt_position: 60, // 0 = louvers closed, 90 = full light
      supported_features: 15
    }
  },

  // Hall fan
  'fan.hall_ceiling_fan': {
    entity_id: 'fan.hall_ceiling_fan',
    state: 'on',
    attributes: {
      friendly_name: 'Hall Ceiling Fan',
      percentage: 66,
      speed_level: 2,
      direction: 'forward',
      oscillating: false
    }
  },

  // Front door lock (Tuya Avant Guard)
  'lock.front_door': {
    entity_id: 'lock.front_door',
    state: 'locked',
    attributes: {
      friendly_name: 'Avant Guard Smart Door Lock',
      battery_level: 94,
      lock_status: 'Secured via Fingerprint',
      last_unlocked: '10:15 AM (Luhgen)'
    }
  },

  // Presence sensor (Lincukoo Hall Radar)
  'binary_sensor.hall_presence': {
    entity_id: 'binary_sensor.hall_presence',
    state: 'on',
    attributes: {
      friendly_name: 'Hall Motion & Millimeter Wave',
      target_distance_m: 2.1,
      illuminance_lux: 240
    }
  },

  // Dining table light (Tuya)
  'light.dining_table_light': {
    entity_id: 'light.dining_table_light',
    state: 'on',
    attributes: {
      friendly_name: 'Dining Chandelier & Table Light',
      brightness: 200,
      color_temp: 340, // Warm amber
      effect: 'warm_ambient'
    }
  },

  // Dining Coffee Bar smart plug
  'switch.dining_coffee_bar': {
    entity_id: 'switch.dining_coffee_bar',
    state: 'on',
    attributes: {
      friendly_name: 'Espresso Machine & Coffee Bar',
      current_power_w: 145,
      today_energy_kwh: 0.62
    }
  },

  // Kitchen range hood / exhaust fan
  'fan.kitchen_exhaust': {
    entity_id: 'fan.kitchen_exhaust',
    state: 'off',
    attributes: {
      friendly_name: 'Kitchen Turbo Range Hood',
      speed_level: 0,
      filter_life_percent: 88,
      light_on: true
    }
  },

  // Gas leak detector
  'binary_sensor.kitchen_gas_detector': {
    entity_id: 'binary_sensor.kitchen_gas_detector',
    state: 'off',
    attributes: {
      friendly_name: 'Kitchen Gas & Smoke Monitor',
      gas_density_ppm: 0,
      status: 'Normal / Protected'
    }
  },

  // Bedroom Split-Unit AC
  'climate.bedroom_ac': {
    entity_id: 'climate.bedroom_ac',
    state: 'off',
    attributes: {
      friendly_name: 'Master Bedroom AC',
      temperature: 23,
      current_temperature: 25.8,
      hvac_action: 'off',
      fan_mode: 'quiet',
      preset_mode: 'sleep'
    }
  },

  // Bedroom ceiling fan
  'fan.bedroom_fan': {
    entity_id: 'fan.bedroom_fan',
    state: 'off',
    attributes: {
      friendly_name: 'Bedroom Ceiling Fan',
      percentage: 0,
      speed_level: 0
    }
  },

  // Bedroom motorized curtain
  'cover.bedroom_curtain': {
    entity_id: 'cover.bedroom_curtain',
    state: 'closed',
    attributes: {
      friendly_name: 'Bedroom Blackout Curtain',
      current_position: 0
    }
  },

  // Balcony automated clothes dryer (Malaysian apartment signature)
  'cover.balcony_clothes_dryer': {
    entity_id: 'cover.balcony_clothes_dryer',
    state: 'open',
    attributes: {
      friendly_name: 'Balcony Smart Clothes Dryer Rack',
      rack_elevation: 85, // % height (85% raised)
      blower_active: false,
      heater_active: false,
      uv_active: false,
      uv_remaining_minutes: 0,
      integrated_light: true
    }
  },

  // Storage / Instant Water Heater
  'switch.water_heater': {
    entity_id: 'switch.water_heater',
    state: 'on',
    attributes: {
      friendly_name: 'Master Bath Storage Water Heater',
      tank_temp_c: 58,
      target_temp_c: 60,
      boost_timer_min: 0,
      power_draw_w: 1800
    }
  },

  // Weather forecast
  'weather.forecast_home': {
    entity_id: 'weather.forecast_home',
    state: 'partlycloudy',
    attributes: {
      friendly_name: 'Subang Jaya / KL Weather',
      temperature: 31,
      humidity: 78,
      wind_speed: 12,
      pressure: 1010
    }
  }
};

export const ZONES: ZoneDefinition[] = [
  {
    id: 'living_room',
    name: 'Living & Media Hall',
    subtitle: 'Haier AC • LG OLED • S95TR • Sheer Curtain',
    iconName: 'Tv',
    entityIds: [
      'climate.living_room_hall_ac',
      'media_player.living_room_lg_tv',
      'media_player.lg_speaker_s95tr',
      'media_player.living_room_living_room',
      'cover.living_room_vertical_curtain',
      'fan.hall_ceiling_fan',
      'binary_sensor.hall_presence'
    ]
  },
  {
    id: 'dining',
    name: 'Dining Area',
    subtitle: 'Tuya Dining Chandelier • Coffee Bar Plug',
    iconName: 'Utensils',
    entityIds: [
      'light.dining_table_light',
      'switch.dining_coffee_bar'
    ]
  },
  {
    id: 'kitchen',
    name: 'Kitchen & Safety',
    subtitle: 'Range Hood • Gas Detector • Under-cabinet',
    iconName: 'Flame',
    entityIds: [
      'fan.kitchen_exhaust',
      'binary_sensor.kitchen_gas_detector'
    ]
  },
  {
    id: 'bedroom',
    name: 'Master Bedroom',
    subtitle: 'Split AC • Ceiling Fan • Blackout Curtain',
    iconName: 'Bed',
    entityIds: [
      'climate.bedroom_ac',
      'fan.bedroom_fan',
      'cover.bedroom_curtain'
    ]
  },
  {
    id: 'balcony',
    name: 'Balcony & Utility',
    subtitle: 'Smart Clothes Dryer • Water Heater',
    iconName: 'SunMedium',
    entityIds: [
      'cover.balcony_clothes_dryer',
      'switch.water_heater'
    ]
  }
];

interface HomeAssistantContextType {
  entities: Record<string, HAEntityState>;
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  haUrl: string;
  haToken: string;
  isDemoMode: boolean;
  saveConfig: (url: string, token: string, isDemo: boolean) => void;
  callService: (domain: string, service: string, serviceData: Record<string, any>) => Promise<void>;
  toggleEntity: (entityId: string) => void;
  setEntityAttribute: (entityId: string, updates: Partial<HAEntityState['attributes']>) => void;
  activeZoneId: string;
  setActiveZoneId: (zoneId: string) => void;
  selectedModalEntityId: string | null;
  setSelectedModalEntityId: (entityId: string | null) => void;
}

const HomeAssistantContext = createContext<HomeAssistantContextType | null>(null);

export const HomeAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entities, setEntities] = useState<Record<string, HAEntityState>>(() => {
    const saved = localStorage.getItem('ha_cached_entities');
    return saved ? { ...INITIAL_ENTITIES, ...JSON.parse(saved) } : INITIAL_ENTITIES;
  });

  const [haUrl, setHaUrl] = useState<string>(() => localStorage.getItem('ha_url') || '');
  const [haToken, setHaToken] = useState<string>(() => localStorage.getItem('ha_token') || '');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => localStorage.getItem('ha_demo_mode') !== 'false');

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const [activeZoneId, setActiveZoneId] = useState('living_room');
  const [selectedModalEntityId, setSelectedModalEntityId] = useState<string | null>(null);

  const connectionRef = useRef<Connection | null>(null);

  // Attempt real WebSocket connection if credentials exist and demo mode is turned off
  useEffect(() => {
    if (isDemoMode || !haUrl || !haToken) {
      setIsConnected(false);
      setIsConnecting(false);
      return;
    }

    let isMounted = true;
    setIsConnecting(true);
    setConnectionError(null);

    const initConnection = async () => {
      try {
        const auth = createLongLivedTokenAuth(haUrl.replace(/\/$/, ''), haToken);
        const connection = await createConnection({ auth });
        
        if (!isMounted) return;
        connectionRef.current = connection;
        setIsConnected(true);
        setIsConnecting(false);

        subscribeEntities(connection, (haEntities) => {
          if (!isMounted) return;
          setEntities((prev) => {
            const next = { ...prev };
            Object.keys(haEntities).forEach((id) => {
              next[id] = haEntities[id] as HAEntityState;
            });
            return next;
          });
        });
      } catch (err: any) {
        if (!isMounted) return;
        console.warn('[HomeAssistant] Connection failed:', err);
        setConnectionError(err?.message || 'Failed to connect to Home Assistant WebSocket');
        setIsConnected(false);
        setIsConnecting(false);
      }
    };

    initConnection();

    return () => {
      isMounted = false;
      if (connectionRef.current) {
        try {
          connectionRef.current.close();
        } catch {}
      }
    };
  }, [haUrl, haToken, isDemoMode]);

  const saveConfig = (url: string, token: string, demo: boolean) => {
    setHaUrl(url);
    setHaToken(token);
    setIsDemoMode(demo);
    localStorage.setItem('ha_url', url);
    localStorage.setItem('ha_token', token);
    localStorage.setItem('ha_demo_mode', String(demo));
  };

  // Optimistic helper for instant UI feedback
  const setEntityAttribute = useCallback((entityId: string, updates: Partial<HAEntityState['attributes']>) => {
    setEntities((prev) => {
      const current = prev[entityId];
      if (!current) return prev;
      return {
        ...prev,
        [entityId]: {
          ...current,
          attributes: {
            ...current.attributes,
            ...updates
          }
        }
      };
    });
  }, []);

  const callService = useCallback(async (domain: string, service: string, serviceData: Record<string, any>) => {
    const entityId = serviceData.entity_id;

    // Optimistic local state updates for rapid response
    if (entityId && entities[entityId]) {
      setEntities((prev) => {
        const current = prev[entityId];
        if (!current) return prev;
        let nextState = current.state;
        const nextAttrs = { ...current.attributes };

        if (service === 'turn_on' || service === 'open') {
          nextState = 'on';
          if (domain === 'cover') nextState = 'open';
        } else if (service === 'turn_off' || service === 'close') {
          nextState = 'off';
          if (domain === 'cover') nextState = 'closed';
        } else if (service === 'toggle') {
          nextState = current.state === 'on' || current.state === 'open' ? 'off' : 'on';
        } else if (service === 'set_temperature' && serviceData.temperature) {
          nextAttrs.temperature = serviceData.temperature;
        } else if (service === 'set_percentage' && serviceData.percentage !== undefined) {
          nextAttrs.percentage = serviceData.percentage;
          nextState = serviceData.percentage > 0 ? 'on' : 'off';
        } else if (service === 'volume_set' && serviceData.volume_level !== undefined) {
          nextAttrs.volume_level = serviceData.volume_level;
        } else if (service === 'set_cover_position' && serviceData.position !== undefined) {
          nextAttrs.current_position = serviceData.position;
          nextState = serviceData.position > 0 ? 'open' : 'closed';
        } else if (service === 'set_cover_tilt_position' && serviceData.tilt_position !== undefined) {
          nextAttrs.current_tilt_position = serviceData.tilt_position;
        }

        return {
          ...prev,
          [entityId]: {
            ...current,
            state: nextState,
            attributes: nextAttrs
          }
        };
      });
    }

    // Forward to real Home Assistant connection if live
    if (connectionRef.current && isConnected) {
      try {
        await haCallService(connectionRef.current, domain, service, serviceData);
      } catch (err) {
        console.error('[HomeAssistant] callService error:', err);
      }
    }
  }, [entities, isConnected]);

  const toggleEntity = useCallback((entityId: string) => {
    const ent = entities[entityId];
    if (!ent) return;
    const domain = entityId.split('.')[0];
    
    if (domain === 'climate') {
      const isOff = ent.state === 'off';
      callService('climate', isOff ? 'set_hvac_mode' : 'turn_off', {
        entity_id: entityId,
        hvac_mode: isOff ? 'cool' : 'off'
      });
    } else if (domain === 'cover') {
      const isOpen = ent.state === 'open' || (ent.attributes.current_position ?? 0) > 0;
      callService('cover', isOpen ? 'close_cover' : 'open_cover', { entity_id: entityId });
    } else if (domain === 'lock') {
      const isLocked = ent.state === 'locked';
      callService('lock', isLocked ? 'unlock' : 'lock', { entity_id: entityId });
    } else if (domain === 'fan') {
      const isOff = ent.state === 'off' || (ent.attributes.percentage ?? 0) === 0;
      callService('fan', isOff ? 'turn_on' : 'turn_off', { 
        entity_id: entityId,
        percentage: isOff ? 66 : 0 
      });
    } else {
      callService(domain, 'toggle', { entity_id: entityId });
    }
  }, [entities, callService]);

  return (
    <HomeAssistantContext.Provider
      value={{
        entities,
        isConnected,
        isConnecting,
        connectionError,
        haUrl,
        haToken,
        isDemoMode,
        saveConfig,
        callService,
        toggleEntity,
        setEntityAttribute,
        activeZoneId,
        setActiveZoneId,
        selectedModalEntityId,
        setSelectedModalEntityId
      }}
    >
      {children}
    </HomeAssistantContext.Provider>
  );
};

export const useHomeAssistant = () => {
  const context = useContext(HomeAssistantContext);
  if (!context) {
    throw new Error('useHomeAssistant must be used within a HomeAssistantProvider');
  }
  return context;
};
