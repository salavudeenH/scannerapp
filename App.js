import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Image,
  Keyboard,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import WebView from 'react-native-webview';

const App = () => {
  const [scannedCode, setScannedCode] = useState('');
  const [isScanned, setIsScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Mode admin activé ou non
  const [baseUrl, setBaseUrl] = useState('https://www.google.com/');
  const [hall, setHall] = useState('b');
  const [location, setLocation] = useState('massy');
  const [modalVisible, setModalVisible] = useState(false); // Modal pour admin
  const [adminPassword, setAdminPassword] = useState(''); // Champ pour mot de passe
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (inputRef.current) {
        inputRef.current.focus(); // Re-focus the TextInput after keyboard hides
      }
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleScan = (code) => {
    if (code.length === 8) {
      setIsLoading(true); // Affiche un écran de chargement
      setTimeout(() => {
        setScannedCode(code);
        setIsScanned(true);
        setIsLoading(false);
        Keyboard.dismiss();
      }, 1000); // Simule un délai de chargement
    }
  };

  const handleChangeText = (text) => {
    setScannedCode(text);

    if (text.length === 8) {
      handleScan(text);
      Keyboard.dismiss();
    }
  };

  const handleBack = () => {
    setScannedCode('');
    setIsScanned(false);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);

    Keyboard.dismiss();
  };

  const handleAdminAccess = () => {
    if (adminPassword === '1234') {
      setIsAdmin(true); // Active le mode admin
      setModalVisible(false); // Cache le modal
      setAdminPassword(''); // Réinitialise le mot de passe
    } else {
      Alert.alert('Erreur', 'Mot de passe incorrect.');
      setAdminPassword(''); // Réinitialise le mot de passe
    }
  };

  const saveSettings = () => {
    Alert.alert('Succès', 'Paramètres sauvegardés avec succès.');
    setIsAdmin(false); // Quitte le mode admin
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isAdmin ? (
        !isScanned ? (
          isLoading ? (
            <View style={styles.loadingScreen}>
              <ActivityIndicator size="large" color="#0078d4" />
              <Text style={styles.loadingText}>Chargement...</Text>
            </View>
          ) : (
            <View style={styles.homeScreen}>
              <TouchableOpacity
                onLongPress={() => setModalVisible(true)}
                delayLongPress={500} // Temps pour activer le long press
              >
                <Image
                  source={require('./public/logo.png')}
                  style={styles.logo}
                />
              </TouchableOpacity>
              <Text style={styles.title}>Welcome to Novaum</Text>
              <Text style={styles.subtitle}>Scannez votre QR code</Text>
              <TextInput
                ref={inputRef}
                style={styles.input}
                editable={true}
                value={scannedCode}
                onChangeText={handleChangeText}
                placeholder="Scannez ici ou entre votre code"
                keyboardType="numeric"
              />
              {/* Modal pour accéder au mode admin */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Connexion Admin</Text>
                    <TextInput
                      style={styles.input}
                      secureTextEntry={true}
                      placeholder="Mot de passe"
                      value={adminPassword}
                      onChangeText={setAdminPassword}
                    />
                    <TouchableOpacity
                      style={[styles.button, styles.buttonValidate]}
                      onPress={handleAdminAccess}
                    >
                      <Text style={styles.textStyle}>Valider</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonCancel]}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.textStyle}>Annuler</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          )
        ) : (
          <View style={styles.webViewScreen}>
            <WebView
              source={{
                uri: `${baseUrl}search?q=${scannedCode}`,
              }}
              style={{ flex: 1 }}
              javaScriptEnabled={true} // Activer JavaScript
              domStorageEnabled={true} // Activer le stockage DOM
              allowFileAccess={true} // Autoriser l'accès aux fichiers locaux
              mixedContentMode="always" // Autoriser les contenus mixtes HTTP/HTTPS
              originWhitelist={['*']} // Autoriser toutes les origines
              cacheEnabled={true} // Désactiver le cache pour éviter des problèmes de compatibilité
              setBuiltInZoomControls={false} // Désactiver les contrôles de zoom intégrés (problème commun sur Android 8)
              renderError={(errorDomain, errorCode, errorDesc) => (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text>Erreur de chargement : {errorDesc}</Text>
                </View>
              )}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('WebView error: ', nativeEvent.description);
              }}
              onHttpError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('HTTP error: ', nativeEvent.statusCode);
              }}
            />

            <TouchableOpacity style={[styles.button, styles.buttonBack]} onPress={handleBack}>
              <Text style={styles.textStyle}>Retour</Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
        // Écran de paramètres admin
        <View style={styles.adminScreen}>
          <Text style={styles.adminTitle}>Paramètres d'Administration</Text>

          {/* Champ pour Base URL */}
          <Text style={styles.label}>URL de Base</Text>
          <TextInput
            style={styles.input}
            value={baseUrl}
            onChangeText={setBaseUrl}
            placeholder="Base URL"
          />

          {/* Champ pour Hall */}
          <Text style={styles.label}>Hall</Text>
          <TextInput
            style={styles.input}
            value={hall}
            onChangeText={setHall}
            placeholder="Hall"
          />

          {/* Champ pour Location */}
          <Text style={styles.label}>Localisation</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Localisation"
          />

          {/* Boutons */}
          <TouchableOpacity style={[styles.button, styles.buttonValidate]} onPress={saveSettings}>
            <Text style={styles.textStyle}>Sauvegarder</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonValidate]}
            onPress={() => setIsAdmin(false)}
          >
            <Text style={styles.textStyle}>Retour</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  homeScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    width: '80%',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
  },
  webViewScreen: {
    flex: 1,
  },
  backButton: {
    textAlign: 'center',
    color: 'blue',
    fontSize: 18,
    padding: 10,
  },
  adminScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  adminTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#0078d4',
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonBack: {
    backgroundColor: '#00387b', // Couleur bleue pour le bouton Retour
    borderRadius: 20,
    padding: 10,
    margin: 15,
    alignSelf: 'center',
    width: '50%', // Taille ajustée pour occuper 50% de la largeur
    alignItems: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width: '80%',
  },
  buttonValidate: {
    backgroundColor: '#00387b',
  },
  buttonCancel: {
    backgroundColor: '#bb1e10',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
