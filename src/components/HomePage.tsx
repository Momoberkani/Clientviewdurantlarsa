import { ImageWithFallback } from './figma/ImageWithFallback';
import { TopBar } from './TopBar';

interface HomePageProps {
  onSelectSunbeds: () => void;
  onSelectRoom: () => void;
  onSelectActivities: () => void;
  notificationCount: number;
  onNotificationClick: () => void;
  isNotificationsOpen: boolean;
  onProfileClick: () => void;
  userName: string;
  roomNumber: string;
}

export function HomePage({ 
  onSelectSunbeds, 
  onSelectRoom,
  onSelectActivities,
  notificationCount,
  onNotificationClick,
  isNotificationsOpen,
  onProfileClick,
  userName,
  roomNumber
}: HomePageProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopBar
        notificationCount={notificationCount}
        onNotificationClick={onNotificationClick}
        isNotificationsOpen={isNotificationsOpen}
        onProfileClick={onProfileClick}
        userName={userName}
        roomNumber={roomNumber}
      />
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-73px)]">
      <div className="max-w-4xl w-full">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <h1 className="text-blue-900 mb-2">Welcome to Grand Paradise Resort, {userName}</h1>
          <p className="text-blue-700 mt-4">What would you like to manage?</p>
        </div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sunbeds Card */}
          <button
            onClick={onSelectSunbeds}
            className="group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 active:scale-100"
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-amber-400 to-orange-500 relative overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1614506660579-c6c478e2f349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb29sJTIwc3VuYmVkJTIwcmVzb3J0fGVufDF8fHx8MTc2MTgzMDE3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Sunbeds by the pool"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-3 w-fit min-w-[150px] text-center">
                  <p className="text-white text-sm whitespace-nowrap">☀️ Pool & Beach</p>
                </div>
                <h3 className="text-white">Sunbeds</h3>
                <p className="text-white/90 text-sm mt-2">Book sunbeds, order drinks & food</p>
              </div>
            </div>
          </button>

          {/* Room Card */}
          <button
            onClick={onSelectRoom}
            className="group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 active:scale-100"
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-purple-400 to-pink-500 relative overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"
                alt="Hotel room"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-3 w-fit min-w-[150px] text-center">
                  <p className="text-white text-sm whitespace-nowrap">🏨 Accommodation</p>
                </div>
                <h3 className="text-white">Room</h3>
                <p className="text-white/90 text-sm mt-2">Room service, housekeeping & more</p>
              </div>
            </div>
          </button>

          {/* Activities Card */}
          <button
            onClick={onSelectActivities}
            className="group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 active:scale-100"
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-teal-400 to-cyan-500 relative overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1669565400547-d93c042debc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjBtYXNzYWdlJTIwcmVzb3J0fGVufDF8fHx8MTc2MTgzNjE4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Spa and wellness"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300 grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-3 w-fit min-w-[150px] text-center">
                  <p className="text-white text-sm whitespace-nowrap">🎯 Coming Soon</p>
                </div>
                <h3 className="text-white">Hotel Activities</h3>
                <p className="text-white/90 text-sm mt-2">Excursions, spa, massage, sports & more</p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-blue-700 text-sm">Need help? Contact reception at extension 0 or visit our front desk</p>
        </div>
      </div>
      </div>
    </div>
  );
}
