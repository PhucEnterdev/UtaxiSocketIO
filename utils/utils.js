
function calculateDestinationCoordinates(lat, lon, distance, bearing) {
    const R = 6371; // Đường kính trái đất trong km
  
    // Chuyển đổi góc sang radian
    const lat1 = lat * (Math.PI / 180);
    const lon1 = lon * (Math.PI / 180);
    const brng = bearing * (Math.PI / 180);
  
    // Tính vị trí mới
    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance / R) +
                Math.cos(lat1) * Math.sin(distance / R) * Math.cos(brng));
    const lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(distance / R) * Math.cos(lat1),
                         Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2));
  
    // Chuyển đổi về đơn vị độ
    const newLat = lat2 * (180 / Math.PI);
    const newLon = lon2 * (180 / Math.PI);
  
    return { mLatitude: newLat, mLongitude: newLon };
  }

module.exports = {
    calculateDestinationCoordinates
}