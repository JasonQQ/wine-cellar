import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Wine, Search, CirclePlus as PlusCircle, User } from 'lucide-react-native';

const WINE_COLOR = '#722F37';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: WINE_COLOR,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: WINE_COLOR,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'My Cellar',
          tabBarLabel: 'Collection',
          headerTitle: 'My Wine Cellar',
          tabBarIcon: ({ color, size }) => (
            <Wine size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Search size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Wine',
          tabBarIcon: ({ color, size }) => (
            <PlusCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E0E0E0',
    height: 60,
    paddingBottom: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: WINE_COLOR,
  },
});