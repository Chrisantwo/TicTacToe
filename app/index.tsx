import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function App() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [showGame, setShowGame] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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
      <TouchableOpacity style={styles.cogIcon} onPress={() => setShowMenu(true)}>
        <Ionicons name="settings" size={28} color="#fff" />
      </TouchableOpacity>

      {winner && (
      <Modal transparent animationType="fade" visible>
        <View style={styles.winnerOverlay}>
          <View style={styles.winnerContainer}>
            <Text style={styles.winnerText}>
              {winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}
            </Text>
            <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
              <Text style={styles.resetText}>Reset Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )}

{!winner && (
  <Text style={styles.turnText}>Turn: {currentPlayer}</Text>
)}

      <View style={styles.board}>
        {board.map((cell, index) => (
          <TouchableOpacity
            key={index}
            style={styles.cell}
            onPress={() => handlePress(index)}
          >
            <Text
  style={[
    styles.cellText,
    cell === "X" && { color: "#F29089" },
    cell === "O" && { color: "#3F7A63" },
  ]}
>
  {cell}
</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={showMenu} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={() => setShowMenu(false)} style={styles.closeButton}>
              <Ionicons name="close-circle" size={28} color="#fff" />
            </TouchableOpacity>

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
      <Text style={styles.title}>TIC</Text>
      <Text style={styles.title}>TAC</Text>
      <Text style={styles.title}>TOE</Text>
      <TouchableOpacity style={styles.playButton} onPress={() => setShowGame(true)}>
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
    backgroundColor: "#105170",
  },
  title: {
    fontSize: 100,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    lineHeight: 98,
    marginVertical: 0,
    paddingVertical: 0,
  },
  board: {
    width: 314,
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 4,
    borderColor: "#964B00",
    borderRadius: 12,
    backgroundColor: "#964B00",
  },
  cell: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
    backgroundColor: "#F0F4F8",
    borderRadius: 12,
  },
  cellText: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#3D619B",
    textAlign: "center",
    lineHeight: 100,
    textAlignVertical: "center",
  },
  resetButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#105170",
    borderRadius: 10,
  },
  playButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#964B00",
    borderRadius: 10,
  },
  resetText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
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
    backgroundColor: "#964B00",
    padding: 20,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
  },
  menuItem: {
    fontSize: 30,
    marginVertical: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    zIndex: 1,
  },
  winnerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  winnerContainer: {
    backgroundColor: "#964B00",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    elevation: 100,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  winnerText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  turnText: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
});