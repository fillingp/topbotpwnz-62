
export type CommandResult = {
  content: string;
  type: 'text' | 'map' | 'weather' | 'image' | 'error';
  data?: any;
  speak?: boolean; // Whether to speak the result
};
