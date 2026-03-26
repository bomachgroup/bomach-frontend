import {
  MapPin,
  Phone,
  Mail,
  Award,
  HeadphonesIcon,
  Building2,
  Trophy,
  Star,
  Cog,
  HardHat,
  Handshake,
  Truck,
  SmilePlus,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MessageCircle,
  CalendarCheck,
  Quote,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Play,
  Search,
  Clock,
  Briefcase,
  FileText,
  User,
  Send,
  Heart,
  Eye,
  ExternalLink,
  Globe,
  Share2,
  CheckCircle,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Map of legacy class names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  // Flaticons
  "flaticon-location": MapPin,
  "flaticon-phone-call": Phone,
  "flaticon-letter": Mail,
  "flaticon-medal": Award,
  "flaticon-support": HeadphonesIcon,
  "flaticon-office-building": Building2,
  "flaticon-trophy": Trophy,
  "flaticon-famous": Star,
  "flaticon-robot-arm": Cog,
  "flaticon-engineer": HardHat,
  "flaticon-partnership": Handshake,
  "flaticon-fast-delivery": Truck,
  "flaticon-recovered": SmilePlus,

  // FontAwesome social
  "fab fa-facebook-f": Facebook,
  "fab fa-facebook": Facebook,
  "fab fa-twitter": Twitter,
  "fab fa-linkedin-in": Linkedin,
  "fab fa-instagram": Instagram,
  "fab fa-whatsapp": MessageCircle,

  // FontAwesome regular
  "far fa-calendar-check": CalendarCheck,
  "far fa-long-arrow-right": ArrowRight,
  "far fa-long-arrow-left": ArrowLeft,
  "far fa-cog": Cog,
  "far fa-envelope-open": Mail,

  // FontAwesome light
  "fal fa-quote-left": Quote,
  "fal fa-angle-double-right": ChevronRight,
  "fal fa-long-arrow-left": ArrowLeft,
  "fal fa-long-arrow-right": ArrowRight,
  "fal fa-map-marker-alt": MapPin,
  "fal fa-phone": Phone,
  "fal fa-share-alt": Share2,
  "fal fa-arrow-right": ArrowRight,

  // FontAwesome solid
  "fas fa-play": Play,
  "fas fa-search": Search,
  "fas fa-map-marker-alt": MapPin,
  "fas fa-chevron-right": ChevronRight,
  "fas fa-chevron-down": ChevronDown,
};

/**
 * Look up a Lucide icon component by legacy CSS class name.
 * Returns the `Info` icon as a fallback if the class name is not mapped.
 */
export function getIcon(className: string): LucideIcon {
  return iconMap[className] || Info;
}

export { iconMap };
export default iconMap;

// Re-export commonly used icons for direct import
export {
  MapPin,
  Phone,
  Mail,
  Award,
  HeadphonesIcon,
  Building2,
  Trophy,
  Star,
  Cog,
  HardHat,
  Handshake,
  Truck,
  SmilePlus,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MessageCircle,
  CalendarCheck,
  Quote,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Play,
  Search,
  Clock,
  Briefcase,
  FileText,
  User,
  Send,
  Heart,
  Eye,
  ExternalLink,
  Globe,
  Share2,
  CheckCircle,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";
