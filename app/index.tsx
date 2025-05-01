import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Cog icon

export default function App() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [showGame, setShowGame] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // NEW

  const checkWinner = (newBoard: string[]) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }

    return newBoard.includes("") ? null : "Draw";
  };

  const handlePress = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setCurrentPlayer("X");
    setWinner(null);
  };

  const renderGameScreen = () => (
    <View style={styles.container}>
      {/* Cog Icon */}
      <TouchableOpacity style={styles.cogIcon} onPress={() => setShowMenu(true)}>
        <Ionicons name="settings" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.status}>
        {winner
          ? winner === "Draw"
            ? "It's a Draw!"
            : `${winner} Wins!`
          : `Turn: ${currentPlayer}`}
      </Text>

      <View style={styles.board}>
        {board.map((cell, index) => (
          <TouchableOpacity
            key={index}
            style={styles.cell}
            onPress={() => handlePress(index)}
          >
            <Text style={styles.cellText}>{cell}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal Menu */}
      <Modal visible={showMenu} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={() => { setShowMenu(false); setShowGame(false); resetGame(); }}>
              <Text style={styles.menuItem}>Main Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { resetGame(); setShowMenu(false); }}>
              <Text style={styles.menuItem}>Reset Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  const renderMainMenu = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <TouchableOpacity style={styles.resetButton} onPress={() => setShowGame(true)}>
        <Text style={styles.resetText}>Play Game</Text>
      </TouchableOpacity>
    </View>
  );

  return showGame ? renderGameScreen() : renderMainMenu();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
  status: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 300,
  },
  cell: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
  },
  cellText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  resetText: {
    color: "#fff",
    fontSize: 18,
  },
  cogIcon: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
  },
  menuItem: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: "bold",
    color: "#007BFF",
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 10,
    zIndex: 1,
  },
  
  closeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#999',
  },
});