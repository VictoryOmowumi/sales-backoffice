import { faker } from "@faker-js/faker";
import { addDays, subMonths, format } from "date-fns";
import type {
  Distributor,
  RepDistributorAssignment,
  RepKpiSnapshot,
  SalesRep,
  SalesRepDirectoryEntry,
  SupervisionAssignment,
  Target,
  Region,
  SalesRole,
  RepStatus
} from "@/domain/sales-team";
import { ORG_REGION_OPTIONS, type OrgRegionId, type OrgRegionName } from "@/config/org";

faker.seed(2405);

const regions: Region[] = ORG_REGION_OPTIONS.map(({ id, label }) => ({
  id,
  name: label,
}));

const regionIdByName = ORG_REGION_OPTIONS.reduce<Record<OrgRegionName, OrgRegionId>>((acc, region) => {
  acc[region.label] = region.id;
  return acc;
}, {} as Record<OrgRegionName, OrgRegionId>);

const getRegionId = (name: OrgRegionName) => regionIdByName[name];

const distributors: Distributor[] = [
  { id: "dist-ikeja", code: "DST-LAG-01", name: "Ikeja Premium Distribution", regionId: getRegionId("Ikeja") },
  { id: "dist-ajah", code: "DST-LAG-02", name: "Lekki Coastal Supply", regionId: getRegionId("Ikeja") },
  { id: "dist-ibadan", code: "DST-SW-01", name: "Ibadan Channel Partners", regionId: getRegionId("Ibadan") },
  { id: "dist-aba", code: "DST-SE-01", name: "Aba Growth Distributors", regionId: getRegionId("Aba") },
  { id: "dist-enugu", code: "DST-SE-02", name: "Enugu Urban Supply", regionId: getRegionId("Enugu") },
  { id: "dist-abuja", code: "DST-NC-01", name: "Abuja Metro Distribution", regionId: getRegionId("Abuja") },
  { id: "dist-kano", code: "DST-NW-01", name: "Kano Northern Traders", regionId: getRegionId("Kano") },
];

const reps: SalesRep[] = [
  {
    id: "rep-001",
    staffCode: "STF-1001",
    firstName: "Adebayo",
    lastName: "Johnson",
    email: "adebayo.johnson@sales.io",
    phone: "+2348012340001",
    role: "dsm",
    regionId: getRegionId("Ikeja"),
    status: "active",
    hiredAt: "2018-02-14",
    avatarUrl: "https://i.pravatar.cc/150?img=54",
  },
  {
    id: "rep-002",
    staffCode: "STF-1002",
    firstName: "Fatima",
    lastName: "Ibrahim",
    email: "fatima.ibrahim@sales.io",
    phone: "+2348012340002",
    role: "rsm",
    regionId: getRegionId("Ikeja"),
    status: "active",
    hiredAt: "2019-07-12",
    avatarUrl: "https://i.pravatar.cc/150?img=21",
  },
  {
    id: "rep-003",
    staffCode: "STF-1003",
    firstName: "Chinedu",
    lastName: "Okeke",
    email: "chinedu.okeke@sales.io",
    phone: "+2348012340003",
    role: "ce",
    regionId: getRegionId("Aba"),
    status: "active",
    hiredAt: "2021-03-03",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "rep-004",
    staffCode: "STF-1004",
    firstName: "Maryam",
    lastName: "Garba",
    email: "maryam.garba@sales.io",
    phone: "+2348012340004",
    role: "ce",
    regionId: getRegionId("Kano"),
    status: "active",
    hiredAt: "2022-05-22",
  },
  {
    id: "rep-005",
    staffCode: "STF-1005",
    firstName: "Samuel",
    lastName: "Adeoye",
    email: "samuel.adeoye@sales.io",
    phone: "+2348012340005",
    role: "ce",
    regionId: getRegionId("Ibadan"),
    status: "inactive",
    hiredAt: "2017-11-01",
  },
  {
    id: "rep-006",
    staffCode: "STF-1006",
    firstName: "Ngozi",
    lastName: "Eze",
    email: "ngozi.eze@sales.io",
    phone: "+2348012340006",
    role: "rsm",
    regionId: getRegionId("Enugu"),
    status: "active",
    hiredAt: "2020-09-15",
    avatarUrl: "https://i.pravatar.cc/150?img=33",
  },
  {
    id: "rep-007",
    staffCode: "STF-1007",
    firstName: "Ibrahim",
    lastName: "Danladi",
    email: "ibrahim.danladi@sales.io",
    phone: "+2348012340007",
    role: "ce",
    regionId: getRegionId("Abuja"),
    status: "active",
    hiredAt: "2023-01-10",
  },
  {
    id: "rep-008",
    staffCode: "STF-1008",
    firstName: "Amaka",
    lastName: "Nwosu",
    email: "amaka.nwosu@sales.io",
    phone: "+2348012340008",
    role: "ce",
    regionId: getRegionId("Enugu"),
    status: "active",
    hiredAt: "2023-04-18",
  },
  {
    id: "rep-009",
    staffCode: "STF-1009",
    firstName: "Tunde",
    lastName: "Fashina",
    phone: "+2348012340009",
    role: "tdm",
    regionId: getRegionId("Ibadan"),
    status: "active",
    hiredAt: "2016-08-09",
  },
  {
    id: "rep-010",
    staffCode: "STF-1010",
    firstName: "Halima",
    lastName: "Abubakar",
    email: "halima.abubakar@sales.io",
    phone: "+2348012340010",
    role: "ce",
    regionId: getRegionId("Kaduna"),
    status: "active",
    hiredAt: "2022-09-30",
  },
  {
    id: "rep-011",
    staffCode: "STF-1011",
    firstName: "Ifeanyi",
    lastName: "Okafor",
    email: "ifeanyi.okafor@sales.io",
    phone: "+2348012340011",
    role: "ce",
    regionId: getRegionId("Ikeja"),
    status: "active",
    hiredAt: "2021-12-05",
  },
  {
    id: "rep-012",
    staffCode: "STF-1012",
    firstName: "Kemi",
    lastName: "Olawale",
    email: "kemi.olawale@sales.io",
    phone: "+2348012340012",
    role: "ce",
    regionId: getRegionId("Ibadan"),
    status: "active",
    hiredAt: "2024-02-01",
  },
];

const assignments: RepDistributorAssignment[] = [
  {
    id: "assign-001",
    repId: "rep-003",
    distributorId: "dist-aba",
    startDate: "2023-01-01",
    assignmentType: "primary",
    createdBy: "system",
  },
  {
    id: "assign-002",
    repId: "rep-003",
    distributorId: "dist-enugu",
    startDate: "2022-01-01",
    endDate: "2022-12-31",
    assignmentType: "primary",
    createdBy: "system",
  },
  {
    id: "assign-003",
    repId: "rep-004",
    distributorId: "dist-kano",
    startDate: "2022-05-22",
    assignmentType: "primary",
    createdBy: "rep-002",
  },
  {
    id: "assign-004",
    repId: "rep-007",
    distributorId: "dist-abuja",
    startDate: "2023-01-15",
    assignmentType: "primary",
    createdBy: "rep-001",
  },
  {
    id: "assign-005",
    repId: "rep-008",
    distributorId: "dist-aba",
    startDate: "2023-04-20",
    assignmentType: "secondary",
    createdBy: "rep-006",
  },
  {
    id: "assign-006",
    repId: "rep-008",
    distributorId: "dist-enugu",
    startDate: "2023-04-20",
    assignmentType: "primary",
    createdBy: "rep-006",
  },
  {
    id: "assign-007",
    repId: "rep-011",
    distributorId: "dist-ikeja",
    startDate: "2021-12-10",
    assignmentType: "primary",
    createdBy: "rep-002",
  },
  {
    id: "assign-008",
    repId: "rep-012",
    distributorId: "dist-ibadan",
    startDate: "2024-02-10",
    assignmentType: "primary",
    createdBy: "rep-009",
  },
  {
    id: "assign-009",
    repId: "rep-005",
    distributorId: "dist-ibadan",
    startDate: "2019-01-01",
    endDate: "2023-03-01",
    assignmentType: "primary",
    createdBy: "rep-009",
  },
];

const supervisionAssignments: SupervisionAssignment[] = [
  {
    id: "sup-001",
    repId: "rep-003",
    supervisorId: "rep-006",
    startDate: "2021-06-01",
  },
  {
    id: "sup-002",
    repId: "rep-004",
    supervisorId: "rep-002",
    startDate: "2022-05-22",
  },
  {
    id: "sup-003",
    repId: "rep-008",
    supervisorId: "rep-006",
    startDate: "2023-04-18",
  },
  {
    id: "sup-004",
    repId: "rep-011",
    supervisorId: "rep-002",
    startDate: "2021-12-05",
  },
  {
    id: "sup-005",
    repId: "rep-007",
    supervisorId: "rep-001",
    startDate: "2023-01-10",
  },
  {
    id: "sup-006",
    repId: "rep-012",
    supervisorId: "rep-009",
    startDate: "2024-02-01",
  },
];

const targetPeriods = ["202403", "202404", "202405"];

const targets: Target[] = reps.flatMap((rep) =>
  targetPeriods.map((period) => ({
    id: `${rep.id}-${period}`,
    repId: rep.id,
    period,
    amount: faker.number.int({ min: 5_000_000, max: 18_000_000 }),
  }))
);

const buildSnapshot = (repId: string, period: string): RepKpiSnapshot => {
  const targetEntry = targets.find((t) => t.repId === repId && t.period === period);
  const targetAmt = targetEntry?.amount ?? 8_000_000;
  const revenue = faker.number.int({ min: 4_000_000, max: 20_000_000 });
  const achievementPct = Math.min(180, Math.round((revenue / targetAmt) * 100));

  return {
    repId,
    period,
    orders: faker.number.int({ min: 18, max: 95 }),
    volume: faker.number.int({ min: 350, max: 2400 }),
    revenue,
    target: targetAmt,
    achievementPct,
  };
};

const kpiSnapshots: RepKpiSnapshot[] = reps.flatMap((rep) =>
  targetPeriods.map((period) => buildSnapshot(rep.id, period))
);

const dataset = {
  regions,
  distributors,
  reps,
  assignments,
  supervisionAssignments,
  targets,
  kpiSnapshots,
};

const currentAssignmentIndex: Record<string, RepDistributorAssignment | undefined> = {};
assignments.forEach((assignment) => {
  if (!assignment.endDate) {
    currentAssignmentIndex[assignment.repId] = assignment;
  }
});

const supervisorIndex: Record<string, SupervisionAssignment | undefined> = {};
supervisionAssignments.forEach((entry) => {
  if (!entry.endDate) {
    supervisorIndex[entry.repId] = entry;
  }
});

export const salesTeamData = dataset;
export const salesTeamRegions = regions;
export const salesTeamDistributors = distributors;
export const salesTeamReps = reps;
export const salesTeamAssignmentHistory = assignments;
export const salesTeamSupervisionHistory = supervisionAssignments;
export const salesTeamTargetPeriods = targetPeriods;

export function getCurrentAssignment(repId: string) {
  const assignment = currentAssignmentIndex[repId];
  if (!assignment) return undefined;
  const distributor = distributors.find((dist) => dist.id === assignment.distributorId);
  if (!distributor) return undefined;

  return {
    ...assignment,
    distributor,
  };
}

export function getCurrentSupervisor(repId: string) {
  const supervision = supervisorIndex[repId];
  if (!supervision) return undefined;
  const supervisor = reps.find((rep) => rep.id === supervision.supervisorId);
  if (!supervisor) return undefined;

  return {
    ...supervision,
    supervisor,
  };
}

export function buildDirectory(): SalesRepDirectoryEntry[] {
  return reps.map((rep) => {
    const region = regions.find((r) => r.id === rep.regionId);
    const assignment = getCurrentAssignment(rep.id);
    const supervisor = getCurrentSupervisor(rep.id)?.supervisor;

    return {
      rep,
      region,
      currentAssignment: assignment
        ? {
            distributor: assignment.distributor,
            assignmentType: assignment.assignmentType,
            startDate: assignment.startDate,
          }
        : undefined,
      supervisor,
    };
  });
}

export function getRepProfileData(repId: string) {
  const rep = reps.find((r) => r.id === repId);
  if (!rep) return undefined;
  const region = regions.find((r) => r.id === rep.regionId);
  const currentAssignment = getCurrentAssignment(repId);
  const currentSupervisor = getCurrentSupervisor(repId);
  const historyAssignments = assignments
    .filter((assign) => assign.repId === repId)
    .sort((a, b) => (b.startDate.localeCompare(a.startDate)))
    .map((entry) => ({
      ...entry,
      distributor: distributors.find((dist) => dist.id === entry.distributorId),
    }));
  const historySupervision = supervisionAssignments
    .filter((sup) => sup.repId === repId)
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .map((entry) => ({
      ...entry,
      supervisor: reps.find((candidate) => candidate.id === entry.supervisorId),
    }));
  const snapshots = kpiSnapshots.filter((snapshot) => snapshot.repId === repId);

  return {
    rep,
    region,
    currentAssignment,
    currentSupervisor,
    historyAssignments,
    historySupervision,
    snapshots,
  };
}

export function getOverviewMetrics(period: string) {
  const snapshotPeriod = period || format(subMonths(new Date(), 0), "yyyyMM");
  const snapshots = kpiSnapshots.filter((entry) => entry.period === snapshotPeriod);
  const activeReps = reps.filter((rep) => rep.status === "active");
  const repsWithAssignments = activeReps.filter((rep) => !!getCurrentAssignment(rep.id));
  const repsWithSupervisors = activeReps.filter((rep) => !!getCurrentSupervisor(rep.id));

  const avgAchievement = snapshots.length
    ? Math.round(
        snapshots.reduce((sum, snap) => sum + snap.achievementPct, 0) / snapshots.length
      )
    : 0;

  const regionAchievement = regions.map((region) => {
    const repsInRegion = reps.filter((rep) => rep.regionId === region.id);
    const ids = repsInRegion.map((rep) => rep.id);
    const regionSnapshots = snapshots.filter((snap) => ids.includes(snap.repId));
    const achievement = regionSnapshots.length
      ? Math.round(regionSnapshots.reduce((sum, snap) => sum + snap.achievementPct, 0) / regionSnapshots.length)
      : 0;

    return {
      region,
      achievement,
      activeReps: repsInRegion.filter((rep) => rep.status === "active").length,
    };
  });

  const topPerformers = snapshots
    .sort((a, b) => b.achievementPct - a.achievementPct)
    .slice(0, 5)
    .map((snapshot) => {
      const rep = reps.find((r) => r.id === snapshot.repId)!;
      return {
        rep,
        snapshot,
      };
    });

  const today = new Date();
  const sevenDaysAhead = addDays(today, 7);
  const assignmentsEndingSoon = assignments
    .filter((assignment) => assignment.endDate)
    .filter((assignment) => {
      const endDate = new Date(assignment.endDate!);
      return endDate >= today && endDate <= sevenDaysAhead;
    })
    .map((assignment) => ({
      assignment,
      rep: reps.find((rep) => rep.id === assignment.repId)!,
      distributor: distributors.find((dist) => dist.id === assignment.distributorId)!,
    }));

  return {
    period: snapshotPeriod,
    totalActiveReps: activeReps.length,
    coveragePct: Math.round((repsWithAssignments.length / activeReps.length) * 100),
    supervisorCoveragePct: Math.round((repsWithSupervisors.length / activeReps.length) * 100),
    avgAchievement,
    regionAchievement,
    topPerformers,
    assignmentsEndingSoon,
  };
}

export function filterDirectory(options: {
  query?: string;
  regionId?: OrgRegionId;
  role?: SalesRole;
  status?: RepStatus;
}) {
  const lowerQuery = options.query?.toLowerCase().trim();
  return buildDirectory().filter((entry) => {
    const { rep, region, currentAssignment } = entry;
    const matchesQuery = !lowerQuery
      ? true
      : [
          rep.firstName,
          rep.lastName,
          rep.staffCode,
          rep.phone,
          rep.email,
          currentAssignment?.distributor.name,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(lowerQuery));

    const matchesRegion = options.regionId ? rep.regionId === options.regionId : true;
    const matchesRole = options.role ? rep.role === options.role : true;
    const matchesStatus = options.status ? rep.status === options.status : true;

    return matchesQuery && matchesRegion && matchesRole && matchesStatus && (!options.regionId || region?.id === options.regionId);
  });
}


