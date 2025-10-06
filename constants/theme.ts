/**
 * Colors and fonts for the Doggopedia app.
 * Primary theme color: #ffe4ff
 * Font: Inter Tight
 */

import { Platform } from "react-native";

const primaryColor = "#ffe4ff";
const tintColorLight = "#d178d1"; // Darker shade of the primary color for contrast
const tintColorDark = "#f5b3f5"; // Lighter shade of the primary color for dark mode

export const Colors = {
  light: {
    text: "#333333",
    background: "#fff",
    primary: primaryColor,
    tint: tintColorLight,
    icon: "#8e4b8e",
    tabIconDefault: "#8e4b8e",
    tabIconSelected: tintColorLight,
    cardBackground: primaryColor,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    primary: "#aa7caa",
    tint: tintColorDark,
    icon: "#d7b3d7",
    tabIconDefault: "#d7b3d7",
    tabIconSelected: tintColorDark,
    cardBackground: "#362f36",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** Main font for the app: Inter Tight */
    sans: "InterTight-Regular",
    semiBold: "InterTight-SemiBold",
    bold: "InterTight-Bold",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "InterTight-Medium",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
