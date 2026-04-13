import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AppRole = "trainer" | "member";
type TrainerScreen = "dashboard" | "schedule" | "clients" | "session" | "hrms" | "billing" | "settings";
type MemberScreen = "welcome" | "onboarding" | "home" | "workouts" | "workoutLive" | "nutrition" | "community" | "membership" | "profile";

type Metric = { label: string; value: string; accent?: boolean };

type AgendaItem = { time: string; title: string; subtitle: string; status: "done" | "next" | "later" };

type PersonCard = { name: string; plan: string; status: string; nextSession: string };

const colors = {
  bg: "#050706",
  panel: "#0E1211",
  softPanel: "#151A18",
  accent: "#8BFF2A",
  accentSoft: "#2A3D14",
  text: "#F6F8F7",
  muted: "#95A29C",
  warn: "#FF6E5A",
  chip: "#1C2420",
};

const trainerOverviewMetrics: Metric[] = [
  { label: "Sessions Today", value: "3" },
  { label: "Active Clients", value: "42", accent: true },
  { label: "HR Actions", value: "2" },
  { label: "Pending Invoices", value: "₹450" },
];

const trainerSchedule: AgendaItem[] = [
  { time: "07:00", title: "Mike R.", subtitle: "HIIT · Main Floor", status: "done" },
  { time: "09:00", title: "Sarah Jenkins", subtitle: "Strength · Weight Room", status: "next" },
  { time: "14:00", title: "Advanced CrossFit", subtitle: "Group · Studio A", status: "later" },
  { time: "18:30", title: "Marcus J.", subtitle: "Conditioning · Turf", status: "later" },
];

const trainerClients: PersonCard[] = [
  { name: "Sarah Jenkins", plan: "Personal Training · 10 Pack", status: "Active", nextSession: "Today, 09:00" },
  { name: "Marcus Johnson", plan: "Strength & Cond. · Monthly", status: "Active", nextSession: "Tomorrow, 14:00" },
  { name: "Emma Davis", plan: "HIIT", status: "Payment Due", nextSession: "Pending" },
];

const memberHighlights: Metric[] = [
  { label: "Streak", value: "7 days", accent: true },
  { label: "Calories", value: "1,240" },
  { label: "Protein", value: "85g" },
  { label: "Steps", value: "8.2k" },
];

const trainerScreens: { key: TrainerScreen; label: string }[] = [
  { key: "dashboard", label: "Overview" },
  { key: "schedule", label: "Schedule" },
  { key: "clients", label: "Clients" },
  { key: "session", label: "Session" },
  { key: "hrms", label: "HRMS" },
  { key: "billing", label: "Billing" },
  { key: "settings", label: "Settings" },
];

const memberScreens: { key: MemberScreen; label: string }[] = [
  { key: "welcome", label: "Welcome" },
  { key: "onboarding", label: "Onboarding" },
  { key: "home", label: "Home" },
  { key: "workouts", label: "Workouts" },
  { key: "workoutLive", label: "Live Workout" },
  { key: "nutrition", label: "Nutrition" },
  { key: "community", label: "Community" },
  { key: "membership", label: "Membership" },
  { key: "profile", label: "Profile" },
];

export default function App() {
  const [role, setRole] = useState<AppRole>("trainer");
  const [trainerScreen, setTrainerScreen] = useState<TrainerScreen>("dashboard");
  const [memberScreen, setMemberScreen] = useState<MemberScreen>("welcome");

  const sectionTitle = useMemo(() => {
    if (role === "trainer") {
      return `Trainer Flow · ${trainerScreens.find((screen) => screen.key === trainerScreen)?.label ?? "Overview"}`;
    }

    return `Member Flow · ${memberScreens.find((screen) => screen.key === memberScreen)?.label ?? "Welcome"}`;
  }, [memberScreen, role, trainerScreen]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.appContainer}>
        <Text style={styles.brand}>GymOS White-label Mobile</Text>
        <Text style={styles.pageTitle}>{sectionTitle}</Text>

        <View style={styles.toggleRow}>
          <ToggleButton title="Trainer" active={role === "trainer"} onPress={() => setRole("trainer")} />
          <ToggleButton title="Member" active={role === "member"} onPress={() => setRole("member")} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subnav}>
          {(role === "trainer" ? trainerScreens : memberScreens).map((screen) => {
            const active = role === "trainer" ? trainerScreen === screen.key : memberScreen === screen.key;
            return (
              <TouchableOpacity
                key={screen.key}
                style={[styles.subnavChip, active && styles.subnavChipActive]}
                onPress={() =>
                  role === "trainer"
                    ? setTrainerScreen(screen.key as TrainerScreen)
                    : setMemberScreen(screen.key as MemberScreen)
                }
              >
                <Text style={[styles.subnavText, active && styles.subnavTextActive]}>{screen.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <ScrollView style={styles.canvas} contentContainerStyle={styles.canvasContent}>
          {role === "trainer" ? <TrainerCanvas screen={trainerScreen} /> : <MemberCanvas screen={memberScreen} />}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function TrainerCanvas({ screen }: { screen: TrainerScreen }) {
  if (screen === "dashboard") {
    return (
      <>
        <Card title="Apex Athletics" subtitle="Tuesday · 3 sessions today">
          <MetricGrid metrics={trainerOverviewMetrics} />
        </Card>
        <Card title="Next Up · 09:00 AM" subtitle="Sarah Jenkins · Strength & Conditioning">
          <ActionRow actions={["Check In", "Message", "Open Profile"]} />
        </Card>
        <Card title="Today\'s Schedule" subtitle="Slot-based attendance view">
          {trainerSchedule.slice(0, 3).map((item) => (
            <TimelineRow key={`${item.time}-${item.title}`} item={item} />
          ))}
        </Card>
      </>
    );
  }

  if (screen === "schedule") {
    return (
      <Card title="October Schedule" subtitle="Time-slot model · All sessions">
        {trainerSchedule.map((item) => (
          <TimelineRow key={`${item.time}-${item.title}`} item={item} />
        ))}
      </Card>
    );
  }

  if (screen === "clients") {
    return (
      <Card title="Client Directory" subtitle="Assigned clients only (RBAC)">
        {trainerClients.map((client) => (
          <ClientRow key={client.name} client={client} />
        ))}
      </Card>
    );
  }

  if (screen === "session") {
    return (
      <>
        <Card title="Session Details" subtitle="Sarah Jenkins · 09:00–10:00">
          <MetricGrid
            metrics={[
              { label: "Status", value: "In Progress", accent: true },
              { label: "Timer", value: "00:45:22" },
              { label: "Location", value: "Weight Room" },
              { label: "Plan", value: "Phase 2" },
            ]}
          />
          <ActionRow actions={["Check Out", "Reschedule", "Cancel"]} />
        </Card>
        <Card title="Workout Plan" subtitle="Strength & Cond. · 8 exercises">
          <Bullet text="Attachment: Nutrition_Guide_Oct.pdf" />
          <Bullet text="Coach Notes: Avoid heavy deadlifts this week." />
        </Card>
      </>
    );
  }

  if (screen === "hrms") {
    return (
      <>
        <Card title="HRMS Hub" subtitle="Trainer workspace">
          <MetricGrid
            metrics={[
              { label: "Time Logged", value: "32.5h", accent: true },
              { label: "Leave Balance", value: "14d" },
              { label: "Approvals", value: "2" },
              { label: "Policy Quiz", value: "Due Oct 30" },
            ]}
          />
        </Card>
        <Card title="Attendance Trends" subtitle="Month-over-month">
          <Bullet text="W1: 30h · W2: 35h · W3: 33h · W4: 38h" />
        </Card>
      </>
    );
  }

  if (screen === "billing") {
    return (
      <>
        <Card title="Billing & Invoices" subtitle="This month">
          <MetricGrid
            metrics={[
              { label: "Revenue", value: "₹4,850", accent: true },
              { label: "Outstanding", value: "₹350" },
              { label: "Paid Invoices", value: "12" },
              { label: "Pending", value: "3" },
            ]}
          />
        </Card>
        <Card title="Recent Invoice" subtitle="INV-2023-089 · Sarah Jenkins">
          <ActionRow actions={["Mark Paid", "Remind", "View PDF"]} />
        </Card>
      </>
    );
  }

  return (
    <>
      <Card title="Profile & Account" subtitle="Alex Morgan · Pro Trainer">
        <Bullet text="Workspace: Apex Fitness Center" />
        <Bullet text="Theme: Dark Lime (white-label ready)" />
      </Card>
      <Card title="Tenant Theme" subtitle="Gym branding from backend">
        <ActionRow actions={["Switch Gym", "Preview Theme", "Save"]} />
      </Card>
    </>
  );
}

function MemberCanvas({ screen }: { screen: MemberScreen }) {
  if (screen === "welcome") {
    return (
      <Card title="FitMe" subtitle="Your ultimate fitness journey starts here.">
        <ActionRow actions={["Create Account", "Sign In"]} />
      </Card>
    );
  }

  if (screen === "onboarding") {
    return (
      <>
        <Card title="Step 1 · Goal Selection" subtitle="Fat Loss selected">
          <Bullet text="Experience: Intermediate" />
          <Bullet text="Preferred Days: 4 / week" />
        </Card>
        <Card title="Step 2 · Personalization" subtitle="Home setup · Knee-friendly">
          <Bullet text="Nutrition: Standard balanced macros" />
          <Bullet text="Injury flags: Knees" />
        </Card>
        <Card title="Step 3 · Connect & Sync" subtitle="Wearables + reminders">
          <ActionRow actions={["Apple Health", "Google Fit", "Generate Plan"]} />
        </Card>
      </>
    );
  }

  if (screen === "home") {
    return (
      <>
        <Card title="Good Morning, Alex" subtitle="Daily tasks almost done">
          <MetricGrid metrics={memberHighlights} />
        </Card>
        <Card title="Today\'s Plan" subtitle="Lower Body Power">
          <ActionRow actions={["Start", "Log Meal", "Check In"]} />
        </Card>
      </>
    );
  }

  if (screen === "workouts") {
    return (
      <Card title="Workouts" subtitle="Featured + Recommended">
        <Bullet text="Full Body Shred · 45 min · High intensity" />
        <Bullet text="Upper Body Power · 30 min" />
        <Bullet text="Core Crusher · 20 min" />
      </Card>
    );
  }

  if (screen === "workoutLive") {
    return (
      <>
        <Card title="Live Workout" subtitle="Full Body Shred · 14:23 elapsed">
          <MetricGrid
            metrics={[
              { label: "Set", value: "1 / 3", accent: true },
              { label: "Reps", value: "12" },
              { label: "Weight", value: "45kg" },
              { label: "Rest", value: "00:45" },
            ]}
          />
          <ActionRow actions={["Pause", "Finish Workout"]} />
        </Card>
        <Card title="Session Complete" subtitle="Save + share progress">
          <Bullet text="Duration: 45:20 · Volume: 12,450 lbs" />
        </Card>
      </>
    );
  }

  if (screen === "nutrition") {
    return (
      <>
        <Card title="Nutrition" subtitle="Calories remaining 1,240">
          <MetricGrid
            metrics={[
              { label: "Protein", value: "85g" },
              { label: "Carbs", value: "120g" },
              { label: "Fats", value: "45g", accent: true },
              { label: "Water", value: "2.6L" },
            ]}
          />
        </Card>
        <Card title="Log Meal" subtitle="Grilled Salmon · 350 kcal">
          <ActionRow actions={["Scan Barcode", "Log Food"]} />
        </Card>
      </>
    );
  }

  if (screen === "community") {
    return (
      <Card title="Community" subtitle="Discover + post updates">
        <Bullet text="30-Day Shred challenge · 80% complete" />
        <Bullet text="Spotlight: Sarah Jenkins story" />
        <Bullet text="Feed: Meal prep, recovery tips, PR updates" />
      </Card>
    );
  }

  if (screen === "membership") {
    return (
      <Card title="Membership" subtitle="Pro Member · billed monthly">
        <MetricGrid
          metrics={[
            { label: "Price", value: "$29.99", accent: true },
            { label: "Classes", value: "Unlimited" },
            { label: "Coach", value: "1-on-1" },
            { label: "Status", value: "Active" },
          ]}
        />
        <ActionRow actions={["Upgrade", "Pause", "Billing History"]} />
      </Card>
    );
  }

  return (
    <Card title="Profile" subtitle="Mike Ryan · Pro Member since 2022">
      <Bullet text="Connected: Apple Health + Garmin" />
      <Bullet text="Push alerts: ON" />
      <ActionRow actions={["Privacy", "Help Center", "Log Out"]} />
    </Card>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <View style={styles.metricGrid}>
      {metrics.map((metric) => (
        <View key={metric.label} style={[styles.metricTile, metric.accent && styles.metricTileAccent]}>
          <Text style={styles.metricValue}>{metric.value}</Text>
          <Text style={styles.metricLabel}>{metric.label}</Text>
        </View>
      ))}
    </View>
  );
}

function TimelineRow({ item }: { item: AgendaItem }) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineTimeBlock}>
        <Text style={styles.timelineTime}>{item.time}</Text>
        <View
          style={[
            styles.statusDot,
            item.status === "done"
              ? styles.doneDot
              : item.status === "next"
                ? styles.nextDot
                : styles.laterDot,
          ]}
        />
      </View>
      <View style={styles.timelineInfo}>
        <Text style={styles.timelineTitle}>{item.title}</Text>
        <Text style={styles.timelineSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );
}

function ClientRow({ client }: { client: PersonCard }) {
  return (
    <View style={styles.clientRow}>
      <View>
        <Text style={styles.timelineTitle}>{client.name}</Text>
        <Text style={styles.timelineSubtitle}>{client.plan}</Text>
      </View>
      <View>
        <Text style={[styles.clientStatus, client.status === "Payment Due" && styles.clientStatusWarn]}>
          {client.status}
        </Text>
        <Text style={styles.timelineSubtitle}>{client.nextSession}</Text>
      </View>
    </View>
  );
}

function ActionRow({ actions }: { actions: string[] }) {
  return (
    <View style={styles.actionRow}>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={action}
          style={[styles.actionButton, index === 0 && styles.actionButtonPrimary]}
          activeOpacity={0.85}
        >
          <Text style={[styles.actionLabel, index === 0 && styles.actionLabelPrimary]}>{action}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bulletDot} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

function ToggleButton({ title, active, onPress }: { title: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.toggleButton, active && styles.toggleButtonActive]} onPress={onPress}>
      <Text style={[styles.toggleText, active && styles.toggleTextActive]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  appContainer: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16, paddingTop: 12 },
  brand: { color: colors.accent, fontSize: 13, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 },
  pageTitle: { color: colors.text, fontSize: 21, fontWeight: "700", marginBottom: 12 },
  toggleRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  toggleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.chip,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: colors.softPanel,
  },
  toggleButtonActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  toggleText: { color: colors.muted, fontWeight: "600" },
  toggleTextActive: { color: colors.accent },
  subnav: { marginBottom: 10, maxHeight: 42 },
  subnavChip: {
    backgroundColor: colors.chip,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1F2A25",
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  subnavChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  subnavText: { color: colors.muted, fontWeight: "600", fontSize: 12 },
  subnavTextActive: { color: "#111714" },
  canvas: { flex: 1 },
  canvasContent: { paddingBottom: 24, gap: 12 },
  card: {
    backgroundColor: colors.panel,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E2722",
    shadowColor: "#8BFF2A",
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  cardTitle: { color: colors.text, fontSize: 17, fontWeight: "700" },
  cardSubtitle: { color: colors.muted, fontSize: 12.5, marginTop: 4, marginBottom: 12 },
  cardBody: { gap: 12 },
  metricGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metricTile: {
    width: "48%",
    minHeight: 72,
    borderRadius: 12,
    backgroundColor: colors.softPanel,
    borderColor: colors.chip,
    borderWidth: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  metricTileAccent: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  metricValue: { color: colors.text, fontSize: 20, fontWeight: "800" },
  metricLabel: { color: colors.muted, fontSize: 11.5 },
  timelineRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#1C2320",
  },
  timelineTimeBlock: { width: 70, flexDirection: "row", alignItems: "center", gap: 8 },
  timelineTime: { color: colors.text, fontWeight: "700" },
  statusDot: { width: 8, height: 8, borderRadius: 999 },
  doneDot: { backgroundColor: "#8E97A1" },
  nextDot: { backgroundColor: colors.accent },
  laterDot: { backgroundColor: "#7254FF" },
  timelineInfo: { flex: 1 },
  timelineTitle: { color: colors.text, fontWeight: "700" },
  timelineSubtitle: { color: colors.muted, fontSize: 12 },
  clientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1F2A25",
    backgroundColor: colors.softPanel,
    borderRadius: 12,
    padding: 12,
  },
  clientStatus: { color: colors.accent, fontWeight: "700", textAlign: "right", fontSize: 12 },
  clientStatusWarn: { color: colors.warn },
  actionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  actionButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#26342D",
    backgroundColor: colors.softPanel,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  actionButtonPrimary: { backgroundColor: colors.accent, borderColor: colors.accent },
  actionLabel: { color: colors.text, fontSize: 12.5, fontWeight: "600" },
  actionLabelPrimary: { color: "#15210E" },
  bulletRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  bulletDot: { width: 6, height: 6, borderRadius: 999, backgroundColor: colors.accent },
  bulletText: { color: colors.muted, flex: 1, fontSize: 12.5 },
});
