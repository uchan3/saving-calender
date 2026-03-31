import React, { useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StreakHero from "../../components/StreakHero";
import TodayNet from "../../components/TodayNet";
import GoalProgress from "../../components/GoalProgress";
import WishlistProgress from "../../components/WishlistProgress";
import QuickRecordGrid from "../../components/QuickRecordGrid";
import RecordForm from "../../components/RecordForm";
import { useRecords } from "../../hooks/useRecords";
import { useGoal } from "../../hooks/useGoal";
import { useWishlist } from "../../hooks/useWishlist";
import {
  calculateStreak,
  formatDate,
  getCumulativeNet,
  getDailySummary,
  getRecordsForDate,
} from "../../stores/recordStore";
import {
  computeAvailableBalance,
  computeUnlockStatus,
  getNextUnlockItem,
} from "../../stores/wishlistStore";
import { getMonthlyNet } from "../../stores/goalStore";
import { DEFAULT_QUICK_PRESETS } from "../../constants/quickPresets";
import { QuickPreset } from "../../types/record";
import { COLORS } from "../../constants/colors";

export default function HomeScreen() {
  const { records, add } = useRecords();

  const today = formatDate(new Date());
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const { goal, set: setGoal } = useGoal(currentYear, currentMonth);
  const { items: wishlistItems } = useWishlist();

  const [showForm, setShowForm] = useState(false);
  const [formDate, setFormDate] = useState(today);

  const streak = useMemo(() => calculateStreak(records), [records]);
  const todaySummary = useMemo(() => getDailySummary(records, today), [records, today]);
  const monthlyNet = getMonthlyNet(records, currentYear, currentMonth);
  const monthLabel = now.toLocaleDateString("en-US", { month: "long" });

  const cumulativeNet = useMemo(() => getCumulativeNet(records), [records]);
  const wishlistAvailableBalance = useMemo(
    () => computeAvailableBalance(cumulativeNet, wishlistItems),
    [cumulativeNet, wishlistItems],
  );
  const wishlistUnlockStatus = useMemo(
    () => computeUnlockStatus(wishlistAvailableBalance, wishlistItems),
    [wishlistAvailableBalance, wishlistItems],
  );
  const wishlistUnlockedCount = useMemo(
    () =>
      wishlistItems.filter((i) => i.purchasedAt == null && wishlistUnlockStatus.get(i.id)?.unlocked)
        .length,
    [wishlistItems, wishlistUnlockStatus],
  );
  const wishlistTotalCount = useMemo(
    () => wishlistItems.filter((i) => i.purchasedAt == null).length,
    [wishlistItems],
  );
  const nextUnlockItem = useMemo(
    () => getNextUnlockItem(wishlistAvailableBalance, wishlistItems),
    [wishlistAvailableBalance, wishlistItems],
  );
  const nextItemProgress = useMemo(() => {
    if (!nextUnlockItem) return 0;
    return nextUnlockItem.price > 0
      ? Math.round(Math.min((wishlistAvailableBalance / nextUnlockItem.price) * 100, 100))
      : 100;
  }, [nextUnlockItem, wishlistAvailableBalance]);

  // Show recovery when streak is 0 and yesterday has no records
  const showRecovery = useMemo(() => {
    if (streak > 0) return false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);
    return getRecordsForDate(records, yesterdayStr).length === 0;
  }, [streak, records]);

  const handleRecoverYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setFormDate(formatDate(yesterday));
    setShowForm(true);
  };

  const handleQuickRecord = async (preset: QuickPreset) => {
    await add(preset.type, preset.label, preset.amount, today);
  };

  const handleMore = () => {
    setFormDate(today);
    setShowForm(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <StreakHero
          streak={streak}
          showRecovery={showRecovery}
          onRecoverYesterday={handleRecoverYesterday}
        />

        <TodayNet
          totalSaving={todaySummary.totalSaving}
          totalSplurge={todaySummary.totalSplurge}
          net={todaySummary.net}
        />

        <GoalProgress
          goal={goal}
          currentAmount={monthlyNet}
          monthLabel={monthLabel}
          onSetGoal={setGoal}
        />

        <WishlistProgress
          availableBalance={wishlistAvailableBalance}
          unlockedCount={wishlistUnlockedCount}
          totalCount={wishlistTotalCount}
          nextItem={nextUnlockItem}
          nextItemProgress={nextItemProgress}
        />

        <QuickRecordGrid
          presets={DEFAULT_QUICK_PRESETS}
          onQuickRecord={handleQuickRecord}
          onMore={handleMore}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal visible={showForm} animationType="slide" testID="record-form-modal">
        <SafeAreaView style={styles.modalContainer}>
          <RecordForm
            date={formDate}
            onSubmit={async (type, category, amount, date, note) => {
              await add(type, category, amount, date, note);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 32,
  },
  bottomSpacer: {
    height: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
