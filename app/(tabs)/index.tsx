import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Modal,
  TextInput,
} from "react-native";
import {
  Plus,
  RefreshCw,
  Grid3X3,
  Settings,
  ChevronUp,
  ChevronDown,
  Check,
  ArrowLeft,
  Sword,
  Moon,
  Sun,
  Info,
  Share,
} from "lucide-react-native";

type Player = {
  id: number;
  name: string;
  initial: string;
  color: string;
  gender: "male" | "female";
  level: number;
  gear: number;
};

const COLORS = [
  "#cc2e2e",
  "#ff0000",
  "#26b937",
  "#00ff00",
  "#3366ff",
  "#0000ff",
  "#ff69b4",
  "#ffa500",
];

type Theme = "light" | "dark";

export default function App() {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Егор", initial: "Е", color: "#cc2e2e", gender: "male", level: 1, gear: 0 },
    { id: 2, name: "Алёна", initial: "А", color: "#26b937", gender: "female", level: 1, gear: 0 },
    { id: 3, name: "Максим", initial: "М", color: "#ff0000", gender: "male", level: 1, gear: 0 },
  ]);

  const [theme, setTheme] = useState<Theme>("light");

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGender, setNewGender] = useState<"male" | "female">("male");
  const [newColor, setNewColor] = useState("#cc2e2e");
  const [nameError, setNameError] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  // Кубик
  const [diceModalVisible, setDiceModalVisible] = useState(false);
  const [diceValue, setDiceValue] = useState(1);

  const rollDice = () => {
    setDiceValue(Math.floor(Math.random() * 6) + 1);
  };

  useEffect(() => {
    if (diceModalVisible) {
      rollDice();
    }
  }, [diceModalVisible]);

  const resetPlayers = () => setPlayers([]);

  const openEditModal = (player: Player) => {
    setCurrentPlayer({ ...player });
    setEditModalVisible(true);
  };

  const saveEditPlayer = () => {
    if (currentPlayer) {
      setPlayers(players.map((p) => (p.id === currentPlayer.id ? currentPlayer : p)));
      setEditModalVisible(false);
    }
  };

  const addPlayer = () => {
    if (newName.trim() === "") {
      setNameError(true);
      return;
    }
    const initial = newName.trim().charAt(0).toUpperCase() || "Н";
    const newPlayer: Player = {
      id: Date.now(),
      name: newName.trim(),
      initial,
      color: newColor,
      gender: newGender,
      level: 1,
      gear: 0,
    };
    setPlayers([...players, newPlayer]);
    setAddModalVisible(false);
    setNewName("");
    setNameError(false);
    setNewGender("male");
    setNewColor("#cc2e2e");
  };

  const themeColors = {
    background: theme === "light" ? "#ffffff" : "#121212",
    text: theme === "light" ? "#000000" : "#ffffff",
    subtitle: theme === "light" ? "#666666" : "#aaaaaa",
    border: theme === "light" ? "#eee" : "#333333",
    modalBackground: theme === "light" ? "#ffffff" : "#1e1e1e",
    avatarText: theme === "light" ? "#ffffff" : "#000000",
    genderColor: theme === "light" ? "#000000" : "#ffffff",
  };

  // Конфигурация точек на кубике
  const diceDots = {
    1: [[50, 50]],
    2: [[30, 30], [70, 70]],
    3: [[30, 30], [50, 50], [70, 70]],
    4: [[30, 30], [30, 70], [70, 30], [70, 70]],
    5: [[30, 30], [30, 70], [50, 50], [70, 30], [70, 70]],
    6: [[30, 20], [30, 50], [30, 80], [70, 20], [70, 50], [70, 80]],
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
        backgroundColor={themeColors.background}
        translucent={true}
      />

      {/* Главный экран */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>Манчкины</Text>
        <View style={styles.iconsRow}>
          <TouchableOpacity onPress={resetPlayers}>
            <RefreshCw size={31} color={themeColors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setDiceModalVisible(true)}>
            <Grid3X3 size={31} color={themeColors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSettingsModalVisible(true)}>
            <Settings size={31} color={themeColors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {players.map((player) => (
          <TouchableOpacity key={player.id} onPress={() => openEditModal(player)} style={styles.playerRow}>
            <View style={[styles.avatar, { backgroundColor: player.color }]}>
              <Text style={[styles.avatarText, { color: themeColors.avatarText }]}>{player.initial}</Text>
            </View>

            <View style={styles.nameRow}>
              <Text style={[styles.playerName, { color: themeColors.text }]}>{player.name}</Text>
              <Text style={[styles.genderSymbol, { color: themeColors.genderColor }]}>
                {player.gender === "male" ? "♂" : "♀"}
              </Text>
            </View>

            <View style={styles.rightSection}>
              <Text style={[styles.score, { color: themeColors.text }]}>{player.level}</Text>
              <ChevronUp size={28} color={themeColors.text} />
              <Text style={[styles.score, { color: themeColors.text }]}>{player.level + player.gear}</Text>
              <Sword size={24} color={themeColors.text} />
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity onPress={() => setAddModalVisible(true)} style={styles.plusButton}>
        <Plus size={60} color="white" strokeWidth={3} />
      </TouchableOpacity>

      {/* Модалка добавления */}
      <Modal visible={addModalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: themeColors.modalBackground }]}>
          <View style={[styles.modalHeader, { borderColor: themeColors.border }]}>
            <TouchableOpacity onPress={() => setAddModalVisible(false)}>
              <ArrowLeft size={28} color={themeColors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>Новый манчкин</Text>
            <TouchableOpacity onPress={addPlayer}>
              <Check size={28} color={themeColors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={[styles.label, { color: themeColors.text }]}>Имя</Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: nameError ? "red" : themeColors.border, color: themeColors.text, backgroundColor: themeColors.background },
              ]}
              value={newName}
              onChangeText={(text) => {
                setNewName(text);
                setNameError(false);
              }}
              placeholder="Введите имя"
              placeholderTextColor={themeColors.subtitle}
              autoFocus={true}
            />

            <Text style={[styles.label, { color: themeColors.text }]}>Пол</Text>
            <View style={styles.radioRow}>
              <TouchableOpacity style={styles.radioButton} onPress={() => setNewGender("male")}>
                <View style={[styles.radioOuter, newGender === "male" && styles.radioSelected]}>
                  {newGender === "male" && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.radioText, { color: themeColors.text }]}>♂</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.radioButton} onPress={() => setNewGender("female")}>
                <View style={[styles.radioOuter, newGender === "female" && styles.radioSelected]}>
                  {newGender === "female" && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.radioText, { color: themeColors.text }]}>♀</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: themeColors.text }]}>Цвет</Text>
            <View style={styles.colorPalette}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    newColor === color && styles.colorSelected,
                  ]}
                  onPress={() => setNewColor(color)}
                />
              ))}
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Модалка редактирования */}
      <Modal visible={editModalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: themeColors.modalBackground }]}>
          <View style={[styles.modalHeader, { borderColor: themeColors.border }]}>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <ArrowLeft size={28} color={themeColors.text} />
            </TouchableOpacity>
            <View />
            <TouchableOpacity onPress={saveEditPlayer}>
              <Check size={28} color={themeColors.text} />
            </TouchableOpacity>
          </View>

          {currentPlayer && (
            <View style={styles.editContent}>
              <Text style={[styles.editName, { color: themeColors.text }]}>{currentPlayer.name}</Text>

              <Text style={[styles.strengthLabel, { color: themeColors.text }]}>Сила</Text>
              <Text style={[styles.strengthValue, { color: themeColors.text }]}>
                {currentPlayer.level + currentPlayer.gear}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setCurrentPlayer({
                    ...currentPlayer,
                    gender: currentPlayer.gender === "male" ? "female" : "male",
                  })
                }
              >
                <Text style={[styles.genderBig, { color: themeColors.text }]}>
                  {currentPlayer.gender === "male" ? "♂" : "♀"}
                </Text>
              </TouchableOpacity>

              <View style={styles.bottomCounters}>
                <View style={styles.counterBlock}>
                  <Text style={[styles.counterLabel, { color: themeColors.text }]}>Уровень</Text>
                  <Text style={[styles.counterValue, { color: themeColors.text }]}>{currentPlayer.level}</Text>
                  <View style={styles.arrowsVertical}>
                    <TouchableOpacity onPress={() => setCurrentPlayer({ ...currentPlayer, level: currentPlayer.level + 1 })}>
                      <ChevronUp size={32} color={themeColors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCurrentPlayer({ ...currentPlayer, level: Math.max(1, currentPlayer.level - 1) })}>
                      <ChevronDown size={32} color={themeColors.text} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.counterBlock}>
                  <Text style={[styles.counterLabel, { color: themeColors.text }]}>Шмотки</Text>
                  <Text style={[styles.counterValue, { color: themeColors.text }]}>{currentPlayer.gear}</Text>
                  <View style={styles.arrowsVertical}>
                    <TouchableOpacity onPress={() => setCurrentPlayer({ ...currentPlayer, gear: currentPlayer.gear + 1 })}>
                      <ChevronUp size={32} color={themeColors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCurrentPlayer({ ...currentPlayer, gear: Math.max(0, currentPlayer.gear - 1) })}>
                      <ChevronDown size={32} color={themeColors.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* Экран настроек */}
      <Modal visible={settingsModalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: themeColors.modalBackground }]}>
          <View style={[styles.modalHeader, { borderColor: themeColors.border }]}>
            <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
              <ArrowLeft size={28} color={themeColors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>Настройки</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.settingsContent}>
            <TouchableOpacity style={styles.settingsItem} onPress={() => setThemeModalVisible(true)}>
              <Moon size={24} color={themeColors.text} />
              <Text style={[styles.settingsText, { color: themeColors.text }]}>Тема</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsItem}>
              <Share size={24} color={themeColors.text} />
              <Text style={[styles.settingsText, { color: themeColors.text }]}>Поделиться</Text>
            </TouchableOpacity>

            <View style={styles.versionRow}>
              <Info size={20} color={themeColors.subtitle} />
              <Text style={[styles.versionLabel, { color: themeColors.text }]}>Версия</Text>
              <Text style={[styles.versionNumber, { color: themeColors.subtitle }]}>16.05.5</Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Модалка выбора темы */}
      <Modal visible={themeModalVisible} animationType="fade" transparent={true}>
        <View style={styles.themeOverlay}>
          <View style={styles.themeModal}>
            <Text style={styles.themeModalTitle}>Тема</Text>

            <TouchableOpacity style={styles.themeOption} onPress={() => { setTheme("light"); setThemeModalVisible(false); }}>
              <View style={[styles.radioOuter, theme === "light" && styles.radioSelected]}>
                {theme === "light" && <View style={styles.radioInner} />}
              </View>
              <Sun size={24} color="#000" />
              <Text style={styles.themeOptionText}>Светлая</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.themeOption} onPress={() => { setTheme("dark"); setThemeModalVisible(false); }}>
              <View style={[styles.radioOuter, theme === "dark" && styles.radioSelected]}>
                {theme === "dark" && <View style={styles.radioInner} />}
              </View>
              <Moon size={24} color="#000" />
              <Text style={styles.themeOptionText}>Тёмная</Text>
            </TouchableOpacity>

            <View style={styles.themeButtons}>
              <TouchableOpacity onPress={() => setThemeModalVisible(false)}>
                <Text style={styles.themeCancel}>ОТМЕНИТЬ</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setThemeModalVisible(false)}>
                <Text style={styles.themeOK}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модалка кубика */}
      <Modal visible={diceModalVisible} transparent={true} animationType="fade">
        <TouchableOpacity
          style={styles.diceOverlay}
          activeOpacity={1}
          onPress={() => setDiceModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={rollDice} style={styles.diceContainer}>
            <View style={styles.diceFace}>
              {diceDots[diceValue].map((dot, index) => (
                <View
                  key={index}
                  style={[styles.diceDot, { left: `${dot[0]}%`, top: `${dot[1]}%` }]}
                />
              ))}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: "bold" },
  iconsRow: { flexDirection: "row", gap: 20 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  playerRow: { flexDirection: "row", alignItems: "center", marginBottom: 28 },
  avatar: { width: 56, height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center", marginRight: 16, flexShrink: 0 },
  avatarText: { fontSize: 36, fontWeight: "bold" },
  nameRow: { flexDirection: "row", alignItems: "center", flexShrink: 0 },
  playerName: { fontSize: 18, fontWeight: "bold", marginRight: 8 },
  genderSymbol: { fontSize: 24 },
  rightSection: { flexDirection: "row", alignItems: "center", gap: 20, marginLeft: "auto", flexShrink: 0 },
  score: { fontSize: 18, fontWeight: "bold" },
  plusButton: { position: "absolute", bottom: 40, right: 24, width: 80, height: 80, borderRadius: 40, backgroundColor: "#720303", justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },

  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  modalTitle: { fontSize: 20, fontWeight: "bold" },
  modalContent: { padding: 24 },

  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  radioRow: { flexDirection: "row", gap: 32, alignItems: "center" },
  radioButton: { flexDirection: "row", alignItems: "center", gap: 8 },
  radioOuter: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "#000", justifyContent: "center", alignItems: "center" },
  radioSelected: { borderColor: "#720303" },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#720303" },
  radioText: { fontSize: 24 },
  colorPalette: { flexDirection: "row", flexWrap: "wrap", gap: 16, justifyContent: "center" },
  colorOption: { width: 48, height: 48, borderRadius: 24 },
  colorSelected: { borderWidth: 4, borderColor: "#000" },

  editContent: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  editName: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  strengthLabel: { fontSize: 18, marginBottom: 8 },
  strengthValue: { fontSize: 72, fontWeight: "bold", marginBottom: 40 },
  genderBig: { fontSize: 64, marginBottom: 60 },
  bottomCounters: { flexDirection: "row", gap: 80 },
  counterBlock: { alignItems: "center" },
  counterLabel: { fontSize: 18, marginBottom: 8 },
  counterValue: { fontSize: 32, fontWeight: "bold", marginBottom: 16 },
  arrowsVertical: { gap: 8 },

  settingsContent: { padding: 24 },
  settingsItem: { flexDirection: "row", alignItems: "center", gap: 16, paddingVertical: 16 },
  settingsText: { fontSize: 18 },
  versionRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 40 },
  versionLabel: { fontSize: 16 },
  versionNumber: { fontSize: 16, marginLeft: "auto" },

  themeOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  themeModal: { backgroundColor: "#ffffff", borderRadius: 16, padding: 24, width: "80%", alignItems: "center" },
  themeModalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 24 },
  themeOption: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 20 },
  themeOptionText: { fontSize: 18 },
  themeButtons: { flexDirection: "row", gap: 40, marginTop: 20 },
  themeCancel: { fontSize: 18, color: "#666" },
  themeOK: { fontSize: 18, fontWeight: "bold" },

  // Кубик
  diceOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  diceContainer: {
    width: 220,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  diceFace: {
    width: 200,
    height: 200,
    backgroundColor: "#3366ff", // синий кубик
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  diceDot: {
    width: 36,
    height: 36,
    backgroundColor: "#ffffff", // белые точки
    borderRadius: 18,
    position: "absolute",
  },
});