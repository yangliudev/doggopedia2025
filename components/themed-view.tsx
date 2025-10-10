import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  useBackground?: boolean;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  useBackground = false,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <View
      style={[useBackground ? { backgroundColor } : {}, style]}
      {...otherProps}
    />
  );
}
