import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [draft, setDraft] = useState('');
  const nextId = useRef(1);

  const addTask = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    setTasks((prev) => [
      ...prev,
      { id: String(nextId.current++), text, done: false },
    ]);
    setDraft('');
  }, [draft]);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }, []);

  const removeTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const renderTask = useCallback(
    ({ item }) => (
      <View style={styles.row}>
        <Pressable
          onPress={() => toggleTask(item.id)}
          hitSlop={8}
          style={[styles.checkbox, item.done && styles.checkboxChecked]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.done }}
        >
          {item.done ? <Text style={styles.checkmark}>✓</Text> : null}
        </Pressable>

        <Text
          style={[styles.taskText, item.done && styles.taskTextDone]}
          numberOfLines={2}
        >
          {item.text}
        </Text>

        <Pressable
          onPress={() => removeTask(item.id)}
          hitSlop={8}
          style={styles.deleteButton}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${item.text}`}
        >
          <Text style={styles.deleteButtonText}>X</Text>
        </Pressable>
      </View>
    ),
    [toggleTask, removeTask]
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'bottom', 'left', 'right']}
      >
        <KeyboardAvoidingView
          style={styles.root}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Text style={styles.title}>My To-Do List</Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={addTask}
              placeholder="What needs to be done?"
              placeholderTextColor="#9a9a9a"
              returnKeyType="done"
              submitBehavior="submit"
            />
            <Pressable
              onPress={addTask}
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.addButtonPressed,
              ]}
              accessibilityRole="button"
            >
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>

          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={renderTask}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text style={styles.empty}>Nothing here yet.</Text>
            }
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  root: { flex: 1, padding: 16 },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    height: 40,
    lineHeight: 40,
    color: '#111111',
  },

  inputRow: {
    flexDirection: 'row',
    height: 48,
    marginTop: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#111111',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 6,
    backgroundColor: '#fafafa',
  },
  addButton: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: '#3f6fd8',
  },
  addButtonPressed: { opacity: 0.75 },
  addButtonText: { fontSize: 16, color: '#ffffff', fontWeight: '600' },

  listContent: { paddingTop: 12, gap: 8 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    gap: 8,
  },
  checkbox: {
    width: 28,
    height: 28,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: '#3f6fd8',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#3f6fd8' },
  checkmark: { color: '#ffffff', fontSize: 16, lineHeight: 18 },

  taskText: { flex: 1, fontSize: 16, color: '#111111' },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#8a8a8a',
  },

  deleteButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: 'rgb(217, 64, 64)',
  },
  deleteButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },

  empty: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 15,
    color: '#9a9a9a',
  },
});