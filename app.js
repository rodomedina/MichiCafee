/* ========================================================
   PERROCAFFE IGUAZÚ - SELVA MISIONERA & GESTIÓN
   Lógica interactiva, pasaporte pet, autenticación y costos
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializaciones
  initYear();
  initNavigation();
  initMenuFilters();
  initCouponGenerator();
  initFidelityPassport();
  initAdminAuth();
  initFinancialCalculator();
});

/* --------------------------------------------------------
   1. AÑO ACTUAL EN FOOTER
   -------------------------------------------------------- */
function initYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* --------------------------------------------------------
   2. NAVEGACIÓN Y MENÚ MOBILE
   -------------------------------------------------------- */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // Active Link on Scroll
  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 130;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------
   3. FILTROS DE MENÚ SELVÁTICO
   -------------------------------------------------------- */
function initMenuFilters() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const menuItems = document.querySelectorAll('.menu-item-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      menuItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'flex';
          item.style.animation = 'fadeIn 0.3s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------
   4. GENERADOR DE CUPÓN SNACK GRATIS
   -------------------------------------------------------- */
function initCouponGenerator() {
  const petNameInput = document.getElementById('petNameInput');
  const claimBtn = document.getElementById('claimCouponBtn');
  const couponResult = document.getElementById('couponResult');

  if (!claimBtn || !couponResult) return;

  claimBtn.addEventListener('click', () => {
    const rawName = petNameInput.value.trim();
    const petName = rawName || 'Tu Mascota';
    const randomCode = 'SELVA-PERRO-' + Math.floor(1000 + Math.random() * 9000);

    couponResult.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1.1rem;">
        <div style="font-size: 2.3rem; color: #b84024;"><i class="fa-solid fa-bone"></i></div>
        <div>
          <h4 style="font-family: 'Fredoka', cursive; font-size: 1.2rem; color: #0b2319; margin-bottom: 2px;">
            ¡Ticket Oficial de Cortesía para: <strong>${escapeHtml(petName)}</strong>!
          </h4>
          <p style="font-size: 0.88rem; color: #536b5e; margin: 0;">
            Mostrá el código <strong>${randomCode}</strong> en PerroCaffe Iguazú y recibí su snack gratis + porción doble especial de bienvenida.
          </p>
        </div>
      </div>
      <div>
        <span style="display: inline-block; background: #2d6a4f; color: #fff; font-weight: 800; font-size: 0.82rem; padding: 0.45rem 0.9rem; border-radius: 999px;">
          ✓ VALIDADO PARA HOY
        </span>
      </div>
    `;
    couponResult.classList.remove('hidden');
    couponResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/* --------------------------------------------------------
   5. PASAPORTE PERROCAFFE CLUB (FIDELIZACIÓN VIRTUAL)
   -------------------------------------------------------- */
const PASSPORT_STORAGE_KEY = 'perrocaffe_passport_data_v1';

function initFidelityPassport() {
  const passportNameDisplay = document.getElementById('passportPetNameDisplay');
  const customPetNameInput = document.getElementById('customPetName');
  const savePetNameBtn = document.getElementById('savePetNameBtn');
  const addStampBtn = document.getElementById('addStampBtn');
  const resetStampsBtn = document.getElementById('resetStampsBtn');
  const stampsRow = document.getElementById('stampsRow');
  const progressFill = document.getElementById('progressFill');
  const stampCountText = document.getElementById('stampCountText');
  const rewardNotification = document.getElementById('rewardNotification');

  let passportData = {
    petName: 'Luna & Firulais',
    stamps: 3
  };

  try {
    const saved = localStorage.getItem(PASSPORT_STORAGE_KEY) || localStorage.getItem('michi_passport_data_v2');
    if (saved) {
      passportData = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Error leyendo localStorage de pasaporte', e);
  }

  function renderPassport() {
    if (passportNameDisplay) {
      passportNameDisplay.textContent = passportData.petName;
    }
    if (customPetNameInput) {
      customPetNameInput.value = passportData.petName;
    }

    if (stampsRow) {
      const slots = stampsRow.querySelectorAll('.stamp-slot');
      slots.forEach((slot, index) => {
        const slotNumber = index + 1;
        if (slotNumber <= passportData.stamps) {
          slot.classList.add('stamped');
        } else {
          slot.classList.remove('stamped');
        }
      });
    }

    const percentage = Math.min((passportData.stamps / 5) * 100, 100);
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }

    if (stampCountText) {
      stampCountText.innerHTML = `<strong>${passportData.stamps} de 5 huellitas</strong> coleccionadas`;
    }

    if (rewardNotification) {
      if (passportData.stamps >= 5) {
        rewardNotification.classList.remove('hidden');
      } else {
        rewardNotification.classList.add('hidden');
      }
    }

    try {
      localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(passportData));
    } catch (e) {
      // Ignorar si cookies deshabilitadas
    }
  }

  if (savePetNameBtn && customPetNameInput) {
    savePetNameBtn.addEventListener('click', () => {
      const newName = customPetNameInput.value.trim();
      if (newName) {
        passportData.petName = newName;
        renderPassport();
        showToast('¡Nombre de mascota actualizado!');
      }
    });
  }

  if (addStampBtn) {
    addStampBtn.addEventListener('click', () => {
      if (passportData.stamps < 5) {
        passportData.stamps += 1;
      } else {
        alert('¡El pasaporte ya tiene sus 5 huellitas completas! Podés reiniciar para comenzar un nuevo ciclo de premios.');
      }
      renderPassport();
    });
  }

  if (resetStampsBtn) {
    resetStampsBtn.addEventListener('click', () => {
      if (confirm('¿Deseas reiniciar las huellitas para un nuevo ciclo de fidelización?')) {
        passportData.stamps = 0;
        renderPassport();
      }
    });
  }

  renderPassport();
}

/* --------------------------------------------------------
   6. AUTENTICACIÓN Y ACCESO PRIVADO AL PANEL
   -------------------------------------------------------- */
const ADMIN_PASS_KEY = 'perrocaffe_admin_pwd_v1';
const DEFAULT_PASS = 'perro2026';

function initAdminAuth() {
  const passwordModal = document.getElementById('passwordModal');
  const adminDashboardModal = document.getElementById('adminDashboardModal');
  const openAdminModalBtn = document.getElementById('openAdminModalBtn');
  const footerAdminBtn = document.getElementById('footerAdminBtn');
  const closePassModalBtn = document.getElementById('closePassModalBtn');
  const cancelPassModalBtn = document.getElementById('cancelPassModalBtn');
  const passwordForm = document.getElementById('passwordForm');
  const adminPasswordInput = document.getElementById('adminPasswordInput');
  const togglePassBtn = document.getElementById('togglePasswordVisibility');
  const eyeIcon = document.getElementById('eyeIcon');
  const passwordError = document.getElementById('passwordError');
  const closeAdminDashboardBtn = document.getElementById('closeAdminDashboardBtn');
  const changePasswordBtn = document.getElementById('changePasswordBtn');
  const printReportBtn = document.getElementById('printReportBtn');

  function getStoredPassword() {
    return localStorage.getItem(ADMIN_PASS_KEY) || localStorage.getItem('michi_admin_pwd_v2') || DEFAULT_PASS;
  }

  function openPasswordModal() {
    passwordError.classList.add('hidden');
    adminPasswordInput.value = '';
    passwordModal.classList.add('active');
    setTimeout(() => adminPasswordInput.focus(), 150);
  }

  function closePasswordModal() {
    passwordModal.classList.remove('active');
  }

  function openAdminDashboard() {
    closePasswordModal();
    adminDashboardModal.classList.add('active');
    recalculateAll();
  }

  function closeAdminDashboard() {
    adminDashboardModal.classList.remove('active');
  }

  if (openAdminModalBtn) openAdminModalBtn.addEventListener('click', openPasswordModal);
  if (footerAdminBtn) footerAdminBtn.addEventListener('click', openPasswordModal);
  if (closePassModalBtn) closePassModalBtn.addEventListener('click', closePasswordModal);
  if (cancelPassModalBtn) cancelPassModalBtn.addEventListener('click', closePasswordModal);
  if (closeAdminDashboardBtn) closeAdminDashboardBtn.addEventListener('click', closeAdminDashboard);

  if (togglePassBtn && adminPasswordInput && eyeIcon) {
    togglePassBtn.addEventListener('click', () => {
      const isPass = adminPasswordInput.type === 'password';
      adminPasswordInput.type = isPass ? 'text' : 'password';
      eyeIcon.classList.toggle('fa-eye', !isPass);
      eyeIcon.classList.toggle('fa-eye-slash', isPass);
    });
  }

  if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = adminPasswordInput.value.trim();
      const correct = getStoredPassword();

      // Permitir la clave configurada, perro2026 o michi2026 de compatibilidad
      if (entered === correct || entered === 'perro2026' || entered === 'michi2026') {
        passwordError.classList.add('hidden');
        openAdminDashboard();
      } else {
        passwordError.classList.remove('hidden');
        adminPasswordInput.focus();
      }
    });
  }

  if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', () => {
      const current = prompt('Ingresá tu contraseña actual:');
      if (current === null) return;

      const validCurrent = getStoredPassword();
      if (current !== validCurrent && current !== 'perro2026' && current !== 'michi2026') {
        alert('La contraseña actual ingresada es incorrecta.');
        return;
      }

      const newPass = prompt('Ingresá tu NUEVA contraseña (mínimo 4 caracteres):');
      if (!newPass || newPass.trim().length < 4) {
        alert('Contraseña inválida. Debe tener al menos 4 caracteres.');
        return;
      }

      localStorage.setItem(ADMIN_PASS_KEY, newPass.trim());
      alert('¡Contraseña actualizada con éxito! Utilizala en tus próximos accesos.');
    });
  }

  if (printReportBtn) {
    printReportBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* --------------------------------------------------------
   7. CALCULADORA FINANCIERA & ESTADO DE RESULTADOS
   (Suma matemática 100% exacta y balanceada)
   -------------------------------------------------------- */
const FINANCIAL_STORAGE_KEY = 'perrocaffe_financial_data_v1';

const DEFAULT_FINANCIALS = {
  costRent: 380000,
  costUtilities: 120000,
  costSalaries: 650000,
  costMarketing: 45000,
  costSoftware: 55000,
  costMaintenance: 50000,
  unitSalePrice: 5800,
  unitBaseCost: 1600,
  unitSnackCost: 280,
  petVisitRatio: 70,
  dailyCustomers: 35,
  openDaysPerMonth: 26
};

function initFinancialCalculator() {
  const inputs = [
    'costRent', 'costUtilities', 'costSalaries', 'costMarketing',
    'costSoftware', 'costMaintenance', 'unitSalePrice', 'unitBaseCost',
    'unitSnackCost', 'petVisitRatio', 'dailyCustomers', 'openDaysPerMonth'
  ];

  loadStoredFinancials();

  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', recalculateAll);
    }
  });

  const saveBtn = document.getElementById('saveFinancialDataBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const currentData = getFormData();
      try {
        localStorage.setItem(FINANCIAL_STORAGE_KEY, JSON.stringify(currentData));
        showToast('¡Costos y proyecciones guardados con éxito!');
      } catch (e) {
        alert('Error al guardar datos en el navegador.');
      }
    });
  }

  const resetBtn = document.getElementById('resetDefaultsBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('¿Restablecer los costos a los valores típicos de Puerto Iguazú?')) {
        populateForm(DEFAULT_FINANCIALS);
        recalculateAll();
        showToast('Valores típicos restablecidos.');
      }
    });
  }

  recalculateAll();
}

function getFormData() {
  const getVal = (id) => Math.max(0, parseFloat(document.getElementById(id)?.value) || 0);

  return {
    costRent: getVal('costRent'),
    costUtilities: getVal('costUtilities'),
    costSalaries: getVal('costSalaries'),
    costMarketing: getVal('costMarketing'),
    costSoftware: getVal('costSoftware'),
    costMaintenance: getVal('costMaintenance'),
    unitSalePrice: Math.max(1, getVal('unitSalePrice')),
    unitBaseCost: getVal('unitBaseCost'),
    unitSnackCost: getVal('unitSnackCost'),
    petVisitRatio: Math.min(100, getVal('petVisitRatio')),
    dailyCustomers: Math.max(1, getVal('dailyCustomers')),
    openDaysPerMonth: Math.max(1, getVal('openDaysPerMonth'))
  };
}

function populateForm(data) {
  Object.keys(data).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = data[id];
  });
}

function loadStoredFinancials() {
  try {
    const saved = localStorage.getItem(FINANCIAL_STORAGE_KEY) || localStorage.getItem('michi_financial_data_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      populateForm(parsed);
    }
  } catch (e) {
    console.warn('No se pudieron cargar datos financieros guardados', e);
  }
}

/* ========================================================
   CÁLCULOS MATEMÁTICOS DE RENTABILIDAD & SUMAS PRECISAS
   ======================================================== */
function recalculateAll() {
  const data = getFormData();

  // 1. Costos Fijos Totales (CFT)
  const totalFixedCosts = data.costRent + data.costUtilities + data.costSalaries +
                          data.costMarketing + data.costSoftware + data.costMaintenance;

  // 2. Ventas y Facturación Bruta Mensual
  const totalMonthlyTickets = Math.round(data.dailyCustomers * data.openDaysPerMonth);
  const grossMonthlyRevenue = totalMonthlyTickets * data.unitSalePrice;

  // 3. Costos Variables Mensuales
  const totalFoodVariableCost = totalMonthlyTickets * data.unitBaseCost;
  const petsServedMonthly = Math.round(totalMonthlyTickets * (data.petVisitRatio / 100));
  const totalSnackPromotionCost = petsServedMonthly * data.unitSnackCost;
  const totalVariableCosts = totalFoodVariableCost + totalSnackPromotionCost;

  // 4. COSTO TOTAL OPERATIVO DEL MES (Fijos + Variables)
  const totalMonthlyOperationalCosts = totalFixedCosts + totalVariableCosts;

  // 5. GANANCIA NETA REAL DEL EMPRENDEDOR
  const netProfit = grossMonthlyRevenue - totalMonthlyOperationalCosts;
  const netProfitMargin = grossMonthlyRevenue > 0 ? ((netProfit / grossMonthlyRevenue) * 100) : 0;

  // 6. Métricas Unitarias y Punto de Equilibrio
  const snackCostPerTicket = data.unitSnackCost * (data.petVisitRatio / 100);
  const unitVariableCost = data.unitBaseCost + snackCostPerTicket;
  const unitMargin = data.unitSalePrice - unitVariableCost;
  const unitMarginPercentage = data.unitSalePrice > 0 ? (unitMargin / data.unitSalePrice) * 100 : 0;

  let breakevenUnits = 0;
  let breakevenRevenue = 0;
  if (unitMargin > 0) {
    breakevenUnits = Math.ceil(totalFixedCosts / unitMargin);
    breakevenRevenue = breakevenUnits * data.unitSalePrice;
  } else {
    breakevenUnits = Infinity;
  }
  const breakevenDailyUnits = Math.ceil(breakevenUnits / data.openDaysPerMonth);

  const snackIncidenceRatio = data.unitSalePrice > 0 ? (snackCostPerTicket / data.unitSalePrice) * 100 : 0;

  // Actualizar Interfaz
  updateDashboardUI({
    totalFixedCosts,
    totalMonthlyTickets,
    grossMonthlyRevenue,
    unitSalePrice: data.unitSalePrice,
    totalFoodVariableCost,
    petsServedMonthly,
    totalSnackPromotionCost,
    totalVariableCosts,
    totalMonthlyOperationalCosts,
    netProfit,
    netProfitMargin,
    unitMargin,
    unitMarginPercentage,
    breakevenUnits,
    breakevenRevenue,
    breakevenDailyUnits,
    snackIncidenceRatio
  });
}

function updateDashboardUI(m) {
  // 1. KPI Cards Superiores
  setText('kpiFixedCosts', formatMoney(m.totalFixedCosts));
  setText('totalFixedCostsText', formatMoney(m.totalFixedCosts));

  // Costos Totales Operativos (Fijos + Variables)
  setText('kpiTotalCosts', formatMoney(m.totalMonthlyOperationalCosts));
  setText('kpiTotalCostsNote', `Fijos: ${formatMoney(m.totalFixedCosts)} | Var: ${formatMoney(m.totalVariableCosts)}`);

  // Ganancia Neta
  const kpiProfitEl = document.getElementById('kpiNetProfit');
  if (kpiProfitEl) {
    kpiProfitEl.textContent = formatMoney(m.netProfit);
    kpiProfitEl.style.color = m.netProfit >= 0 ? '#1b8a5a' : '#c0392b';
  }
  setText('kpiProfitMargin', `Margen Neto: ${m.netProfitMargin.toFixed(1)}%`);

  // Punto de Equilibrio KPI
  if (m.breakevenUnits === Infinity) {
    setText('kpiBreakevenUnits', 'Inviable');
    setText('kpiBreakevenAmount', 'Precio menor al costo unitario');
  } else {
    setText('kpiBreakevenUnits', `${m.breakevenUnits.toLocaleString('es-AR')} tickets`);
    setText('kpiBreakevenAmount', `Equivale a ${formatMoney(m.breakevenRevenue)}/mes`);
  }

  // Subtítulo proyección
  setText('totalMonthlySalesText', `${m.totalMonthlyTickets.toLocaleString('es-AR')} tickets al mes`);

  // Métricas Punto de Equilibrio
  setText('peUnits', m.breakevenUnits === Infinity ? 'N/A' : m.breakevenUnits.toLocaleString('es-AR'));
  setText('peDailyUnits', m.breakevenUnits === Infinity ? 'N/A' : m.breakevenDailyUnits.toLocaleString('es-AR'));
  setText('peRevenue', formatMoney(m.breakevenRevenue));

  // Barra visual de meta vs punto de equilibrio
  const targetFillBar = document.getElementById('targetFillBar');
  const peIndicatorLine = document.getElementById('peIndicatorLine');
  const breakevenStatusText = document.getElementById('breakevenStatusText');

  if (targetFillBar && peIndicatorLine && breakevenStatusText) {
    if (m.breakevenUnits === Infinity) {
      targetFillBar.style.width = '0%';
      breakevenStatusText.innerHTML = `<span class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> <strong>Cuidado:</strong> El precio actual no cubre los costos variables.</span>`;
    } else {
      const maxScale = Math.max(m.breakevenUnits * 1.5, m.totalMonthlyTickets * 1.15);
      const pePercent = Math.min(100, Math.max(5, (m.breakevenUnits / maxScale) * 100));
      const currentPercent = Math.min(100, Math.max(0, (m.totalMonthlyTickets / maxScale) * 100));

      peIndicatorLine.style.left = `${pePercent}%`;
      targetFillBar.style.width = `${currentPercent}%`;

      if (m.totalMonthlyTickets >= m.breakevenUnits) {
        const surplus = m.totalMonthlyTickets - m.breakevenUnits;
        breakevenStatusText.innerHTML = `
          <i class="fa-solid fa-circle-check text-emerald"></i> 
          <strong>¡Zona de Ganancia Neta!</strong> Superás el punto de equilibrio por <strong>${surplus.toLocaleString('es-AR')} tickets</strong> al mes.
        `;
      } else {
        const deficit = m.breakevenUnits - m.totalMonthlyTickets;
        breakevenStatusText.innerHTML = `
          <i class="fa-solid fa-triangle-exclamation text-danger"></i> 
          <strong>Atención:</strong> Faltan <strong>${deficit.toLocaleString('es-AR')} tickets</strong> al mes para cubrir todos los gastos y empezar a ganar.
        `;
      }
    }
  }

  // 2. Tabla de Estado de Resultados (Suma 100% Transparente)
  setText('tableTicketCount', m.totalMonthlyTickets.toLocaleString('es-AR'));
  setText('tableTicketPrice', formatMoney(m.unitSalePrice));
  setText('tableGrossRevenue', formatMoney(m.grossMonthlyRevenue));

  setText('tableFoodQty', m.totalMonthlyTickets.toLocaleString('es-AR'));
  setText('tableVariableCosts', `- ${formatMoney(m.totalFoodVariableCost)}`);

  setText('tablePetSnackCount', m.petsServedMonthly.toLocaleString('es-AR'));
  setText('tableSnackCosts', `- ${formatMoney(m.totalSnackPromotionCost)}`);

  setText('tableFixedCosts', `- ${formatMoney(m.totalFixedCosts)}`);

  // Total Costos Operativos
  setText('tableTotalOperationalCosts', formatMoney(m.totalMonthlyOperationalCosts));

  // Fórmula visual de confirmación matemática
  setText('mathGross', formatNumber(m.grossMonthlyRevenue));
  setText('mathCosts', formatNumber(m.totalMonthlyOperationalCosts));

  // Ganancia Neta Final en la Tabla
  const tableProfitEl = document.getElementById('tableNetProfit');
  if (tableProfitEl) {
    tableProfitEl.textContent = formatMoney(m.netProfit);
    tableProfitEl.style.color = m.netProfit >= 0 ? '#14532d' : '#b91c1c';
  }

  // 3. Métricas Unitarias
  setText('unitMarginVal', formatMoney(m.unitMargin));
  setText('unitMarginPercent', `${m.unitMarginPercentage.toFixed(1)}% sobre precio`);
  setText('snackIncidenceVal', `${m.snackIncidenceRatio.toFixed(1)}%`);

  // Diagnóstico
  generateInsights(m);
}

function generateInsights(m) {
  const list = document.getElementById('insightsList');
  if (!list) return;

  const insights = [];

  // Incidencia snack pet
  if (m.snackIncidenceRatio < 5) {
    insights.push(`<strong>Estrategia de Fidelización Óptima:</strong> La inversión en snacks gratuitos para mascotas solo representa un <strong>${m.snackIncidenceRatio.toFixed(1)}%</strong> de cada ticket. Es una herramienta publicitaria sumamente rentable que atrae tanto a locales como a turistas en Iguazú a PerroCaffe.`);
  } else {
    insights.push(`<strong>Control del costo de snack:</strong> El snack representa un <strong>${m.snackIncidenceRatio.toFixed(1)}%</strong> del ticket. Podés optimizarlo elaborando tandas semanales propias con avena y frutas regionales.`);
  }

  // Balance y Rentabilidad
  if (m.netProfitMargin > 25) {
    insights.push(`<strong>Rentabilidad Sobresaliente:</strong> Tu margen neto estimado del <strong>${m.netProfitMargin.toFixed(1)}%</strong> supera holgadamente el promedio de la industria gastronómica tradicional (15% a 20%).`);
  } else if (m.netProfitMargin > 0) {
    insights.push(`<strong>Operación Positiva:</strong> Tu margen neto es del <strong>${m.netProfitMargin.toFixed(1)}%</strong>. Para potenciarlo, podés fomentar combos misioneros (café + chipá + torta) para elevar el ticket promedio.`);
  } else {
    insights.push(`<strong>Alerta de Déficit:</strong> Con los parámetros ingresados los costos totales ($ ${formatNumber(m.totalMonthlyOperationalCosts)}) superan la facturación proyectada. Ajustá los costos fijos o aumentá la cantidad de tickets diarios.`);
  }

  insights.push(`Tu meta de supervivencia: vendiendo <strong>${m.breakevenDailyUnits} tickets diarios</strong> cubrís el 100% de los costos fijos y variables del mes.`);

  list.innerHTML = insights.map(i => `<li>${i}</li>`).join('');
}

/* --------------------------------------------------------
   UTILIDADES & FORMATEADORES DE MONEDA
   -------------------------------------------------------- */
function formatMoney(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) return '$ 0';
  const isNegative = amount < 0;
  const abs = Math.round(Math.abs(amount));
  const formatted = abs.toLocaleString('es-AR');
  return isNegative ? `- $ ${formatted}` : `$ ${formatted}`;
}

function formatNumber(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) return '0';
  return Math.round(Math.abs(amount)).toLocaleString('es-AR');
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.right = '24px';
  toast.style.background = '#143d2c';
  toast.style.color = '#ffffff';
  toast.style.padding = '0.95rem 1.5rem';
  toast.style.borderRadius = '999px';
  toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25)';
  toast.style.zIndex = '9999';
  toast.style.fontWeight = '700';
  toast.style.fontSize = '0.92rem';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '0.6rem';
  toast.style.border = '1px solid rgba(82, 183, 136, 0.4)';
  toast.innerHTML = `<i class="fa-solid fa-paw" style="color: #52b788;"></i> ${message}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(() => toast.remove(), 400);
  }, 2800);
}
