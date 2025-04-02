import {
  Calendar,
  Home,
  Users,
  FileText,
  Settings,
  BarChart2,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard', active: true },
  { icon: Calendar, label: 'Appointments', href: '/' },
  { icon: Users, label: 'Patients', href: '/' },
  { icon: Clock, label: 'Scheduling', href: '/' },
  { icon: FileText, label: 'Medical Records', href: '/' },
  { icon: BarChart2, label: 'Reports', href: '/' },
  { icon: Settings, label: 'Settings', href: '/' },
];

export function Sidebar() {
  return (
    <div className="hidden border-r bg-background md:block md:w-64">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground',
                  item.active && 'bg-muted font-medium text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted p-3 text-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-teal-600">
              <span className="font-semibold">SJ</span>
            </div>
            <div>
              <div className="font-medium">Dr. Sarah Johnson</div>
              <div className="text-xs text-muted-foreground">Cardiologist</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
