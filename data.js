// ============================================
// TUMAN MA'LUMOTLARI - data.js
// ============================================

const districtsData = {
    'tashkent-city': ['Chilonzor', 'Mirabad', 'Sergeli', 'Shayhontohur', 'Yashnobod', 'Yunusabad'],
    'tashkent-region': ['Bekabod', 'Chinobod', 'Angren', 'Yangiyul', 'Tashkent tumani', 'Parkent', 'Oqqo\'rgon'],
    'samarkand': ['Samarkand shahar', 'Payariq', 'Kattaqo\'rg\'on', 'Bulungur', 'Jomboy', 'Qo\'shrabod'],
    'bukhara': ['Bukhara shahar', 'Gazli', 'Karakul', 'Shafirkon', 'Romitan', 'Buxoro tumani'],
    'kashkadarya': ['Qarshi', 'Kitab', 'Koson', 'Chiroqchi', 'Kamashi', 'Muborak'],
    'navoi': ['Navoi shahar', 'Karmana', 'Tomdi', 'Xatirchi', 'Gazli', 'Zarafshon'],
    'andijan': ['Andijon shahar', 'Marhamat', 'Xonobod', 'Asaka', 'Baliqchi', 'Paxtaobod'],
    'fergana': ['Fergona shahar', 'Kuva', 'Beshariq', 'Uchkoprik', 'Tashloq', 'Qo\'qon'],
    'namangan': ['Namangan shahar', 'Chortoq', 'Mingbulak', 'Pop', 'Chust', 'Kasansay'],
    'karakalpakstan': ['Nukus', 'Turtkul', 'Qo\'ng\'irot', 'Amudarya', 'Bozatau'],
    'surxandarya': ['Termiz', 'Boysun', 'Kumqo\'rg\'on', 'Denov', 'Jarqo\'rg\'on', 'Qumqo\'rg\'on'],
    'jizzakh': ['Jizzax shahar', 'Zaamin', 'Forish', 'Jizzax tumani', 'Paxtakor']
};

/**
 * Viloyatga qarab tumanlarni yuklash
 */
function loadDistricts() {
    const region = document.getElementById('region').value;
    const districtSelect = document.getElementById('district');

    // Avvalgi tumanlarni tozalash
    districtSelect.innerHTML = '<option value="">-- Tuman tanlang --</option>';

    if (!region) {
        return;
    }

    // Viloyatga tegishli tumanlarni qo'shish
    const districts = districtsData[region] || [];
    
    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });
}