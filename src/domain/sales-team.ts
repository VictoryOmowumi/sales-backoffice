import type { OrgRegionId, SalesRoleId } from "@/config/org";

export type SalesRole = SalesRoleId;
export type RepStatus = "active" | "inactive";
export type AssignmentType = "primary" | "secondary";

export interface Region {
  id: OrgRegionId;
  name: string;
}

export interface Distributor {
  id: string;
  code: string;
  name: string;
  regionId: string;
}

export interface SalesRep {
  id: string;
  staffCode: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  role: SalesRole;
  regionId: OrgRegionId;
  status: RepStatus;
  hiredAt: string;
  avatarUrl?: string;
}

export interface RepDistributorAssignment {
  id: string;
  repId: string;
  distributorId: string;
  startDate: string;
  endDate?: string;
  assignmentType: AssignmentType;
  createdBy: string;
  reason?: string;
}

export interface SupervisionAssignment {
  id: string;
  repId: string;
  supervisorId: string;
  startDate: string;
  endDate?: string;
}

export interface Target {
  id: string;
  repId: string;
  period: string; // YYYYMM
  amount: number;
}

export interface RepKpiSnapshot {
  repId: string;
  period: string;
  orders: number;
  volume: number;
  revenue: number;
  target: number;
  achievementPct: number;
}

export interface SalesRepDirectoryEntry {
  rep: SalesRep;
  region?: Region;
  supervisor?: SalesRep;
  currentAssignment?: {
    distributor: Distributor;
    assignmentType: AssignmentType;
    startDate: string;
  };
}


