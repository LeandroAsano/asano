import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../src/theme/tokens";

/**
 * Layout raíz de la app (reemplaza al viejo App.tsx + RootNavigator).
 *
 * - SafeAreaProvider: permite que las pantallas respeten el "notch" y las
 *   zonas seguras del teléfono.
 * - Stack: el contenedor de navegación de Expo Router. Cada archivo dentro
 *   de app/ se vuelve una pantalla dentro de este Stack automáticamente.
 * - headerShown: false → por ahora manejamos los títulos dentro de cada
 *   pantalla; más adelante podemos usar el header nativo si conviene.
 * - StatusBar style="dark": como el fondo ahora es claro (crema), los íconos
 *   de la barra de estado (hora, batería) van en oscuro para que se lean.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
