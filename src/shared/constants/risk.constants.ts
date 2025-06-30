export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export const RiskThresholds = {
  [RiskLevel.LOW]: 0.3,
  [RiskLevel.MEDIUM]: 0.6,
  [RiskLevel.HIGH]: 0.9,
};