export interface IMezzoServerPlugin {
  name: string;
  initialize?: () => void;
  onStop?: () => void;
}
