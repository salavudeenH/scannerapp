//webwiew

// import React, { useState, useRef } from 'react';
// import { SafeAreaView, Button, View, Text, StyleSheet } from 'react-native';
// import { WebView } from 'react-native-webview';

// const App = () => {
//   // Référence pour contrôler le WebView
//   const webViewRef = useRef(null);
//   const [url, setUrl] = useState('https://www.google.com'); // URL initiale

//   // Fonction pour ouvrir un autre lien dans le WebView
//   const openWebView = () => {
//     setUrl('https://www.example.com'); // Change l'URL à afficher
//   };

//   // Fonction pour revenir en arrière dans le WebView
//   const goBack = () => {
//     if (webViewRef.current) {
//       webViewRef.current.goBack();
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Afficher un bouton pour ouvrir une nouvelle URL */}
//       <View style={styles.buttonContainer}>
//         <Button title="Ouvrir WebView" onPress={openWebView} />
//         <Button title="Revenir en arrière" onPress={goBack} />
//       </View>

//       {/* Affichage du WebView */}
//       <View style={styles.webViewContainer}>
//         <WebView
//           ref={webViewRef}
//           source={{ uri: url }}
//           style={{ flex: 1 }}
//           onNavigationStateChange={(navState) => {
//             // Logique pour gérer les états si besoin
//             console.log('URL actuelle :', navState.url);
//           }}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     padding: 10,
//   },
//   webViewContainer: {
//     flex: 1,
//     marginTop: 10,
//   },
// });

// export default App;


//code avec le bouton et le text input v2 

// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';
// import WebView from 'react-native-webview';

// const App = () => {
//   const [scannedCode, setScannedCode] = useState('');
//   const [isScanned, setIsScanned] = useState(false);

//   const handleScan = (code) => {
//     setScannedCode(code);
//     setIsScanned(true); // Passe à l'écran WebView
//   };

//   const handleBack = () => {
//     setScannedCode('');
//     setIsScanned(false); // Retour à l'écran d'accueil
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {!isScanned ? (
//         // Écran d'accueil
//         <View style={styles.homeScreen}>
//           <Text style={styles.title}>Bienvenue chez Carrefour</Text>
//           <Text style={styles.subtitle}>Scanner votre QR code</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Entrez le code scanné ici"
//             onChangeText={(text) => setScannedCode(text)}
//             value={scannedCode}
//           />
//           <Button
//             title="Scanner"
//             onPress={() => handleScan(scannedCode)}
//             disabled={!scannedCode} // Désactiver le bouton si aucun code
//           />
//         </View>
//       ) : (
//         // Écran WebView
//         <View style={styles.webViewScreen}>
//           <WebView
//             source={{
//               uri: `https://int-servicenow.fr.carrefour.com/checkin?id=wvc_register_qr&number=${scannedCode}&hall=b`,
//             }}
//             style={{ flex: 1 }}
//           />
//           <Button title="Retour" onPress={handleBack} />
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f4f4f4',
//   },
//   homeScreen: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   subtitle: {
//     fontSize: 18,
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     width: '80%',
//     padding: 10,
//     marginBottom: 20,
//     backgroundColor: '#fff',
//     textAlign: 'center',
//   },
//   webViewScreen: {
//     flex: 1,
//   },
// });

// export default App;

//V3 sans admin
// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, TextInput, Image, Keyboard } from 'react-native';
// import WebView from 'react-native-webview';

// const App = () => {
//   const [scannedCode, setScannedCode] = useState('');
//   const [isScanned, setIsScanned] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const inputRef = useRef(null);  // Créer une référence pour le TextInput

//   useEffect(() => {
//     if (inputRef.current) {
//       inputRef.current.focus();  // Focus sur l'input au début
//     }
//   }, []);

//   const handleScan = (code) => {
//     if (code.length === 8) {
//       setIsLoading(true); // Affiche un écran de chargement
//       setTimeout(() => {
//         setScannedCode(code); // Met à jour le code scanné
//         setIsScanned(true); // Passe à l'écran WebView
//         setIsLoading(false);
//         Keyboard.dismiss();  // Ferme le clavier
//       }, 1000); // Simule un délai de chargement
//     }
//   };

//   const handleChangeText = (text) => {
//     setScannedCode(text); // Met à jour le texte saisi

//     // Dès que le code atteint 8 chiffres, le traiter
//     if (text.length === 8) {
//       handleScan(text);
//       Keyboard.dismiss();  // Ferme le clavier lorsque 8 caractères sont saisis
//     }
//   };

//   const handleBack = () => {
//     setScannedCode(''); // Réinitialiser le code scanné
//     setIsScanned(false); // Retour à l'écran d'accueil

//     // Ajouter un délai pour gérer correctement le focus sur le TextInput
//     setTimeout(() => {
//       if (inputRef.current) {
//         inputRef.current.focus(); // Re-focus sur le champ d'entrée après le retour
//       }
//     }, 100); // Petit délai pour s'assurer que l'écran se charge avant de refocus

//     Keyboard.dismiss(); // Ferme le clavier lorsque l'on revient à l'écran d'accueil
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {!isScanned ? (
//         isLoading ? (
//           // Écran de chargement
//           <View style={styles.loadingScreen}>
//             <ActivityIndicator size="large" color="#0078d4" />
//             <Text style={styles.loadingText}>Chargement...</Text>
//           </View>
//         ) : (
//           // Écran d'accueil
//           <View style={styles.homeScreen}>
//             {/* Logo Carrefour en haut */}
//             <Image
//               source={require('./public/logo.png')}  // Remplacez avec le chemin vers votre logo
//               style={styles.logo}
//             />

//             <Text style={styles.title}>Bienvenue chez Carrefour</Text>
//             <Text style={styles.subtitle}>Scannez votre QR code</Text>

//             {/* Champ de texte visible */}
//             <TextInput
//               ref={inputRef}
//               style={styles.input}  // Le champ est visible
//               editable={true} // Permet à l'utilisateur de saisir un code
//               value={scannedCode}
//               onChangeText={handleChangeText}
//               placeholder="Scannez ici"
//               keyboardType="numeric" // Affiche un clavier numérique pour la saisie
//             />
//           </View>
//         )
//       ) : (
//         // Écran WebView
//         <View style={styles.webViewScreen}>
//           <WebView
//             source={{
//               uri: `https://int-servicenow.fr.carrefour.com/checkin?id=wvc_register_qr&number=${scannedCode}&hall=b`,
//             }}
//             style={{ flex: 1 }}
//           />
//           <Text style={styles.backButton} onPress={handleBack}>
//             Retour
//           </Text>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f4f4f4',
//   },
//   homeScreen: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   logo: {
//     width: 300,    // Ajuste la taille du logo
//     height: 200,   // Ajuste la taille du logo
//     marginBottom: 20, // Un peu d'espace sous le logo
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   subtitle: {
//     fontSize: 18,
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     padding: 10,
//     width: '80%',
//     textAlign: 'center',
//     fontSize: 16,
//   },
//   loadingScreen: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     fontSize: 16,
//     marginTop: 10,
//   },
//   webViewScreen: {
//     flex: 1,
//   },
//   backButton: {
//     textAlign: 'center',
//     color: 'blue',
//     fontSize: 18,
//     padding: 10,
//   },
// });
