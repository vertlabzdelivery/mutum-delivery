const STORAGE_KEYS = {
  apiBaseUrl: 'deliveryRestaurantPanel.apiBaseUrl',
  accessToken: 'deliveryRestaurantPanel.accessToken',
  refreshToken: 'deliveryRestaurantPanel.refreshToken',
  currentUser: 'deliveryRestaurantPanel.currentUser',
  currentRestaurantId: 'deliveryRestaurantPanel.currentRestaurantId'
};

const STATUS_LABELS = {
  PENDING: 'Pendente',
  ACCEPTED: 'Aceito',
  PREPARING: 'Em preparo',
  DELIVERY: 'Saiu para entrega',
  DELIVERED: 'Entregue',
  CANCELED: 'Cancelado'
};

const ORDER_STATUS_FLOW = {
  PENDING: ['ACCEPTED', 'CANCELED'],
  ACCEPTED: ['PREPARING', 'CANCELED'],
  PREPARING: ['DELIVERY', 'CANCELED'],
  DELIVERY: ['DELIVERED'],
  DELIVERED: [],
  CANCELED: []
};

const state = {
    accessToken: localStorage.getItem(STORAGE_KEYS.accessToken) || '',
  refreshToken: localStorage.getItem(STORAGE_KEYS.refreshToken) || '',
  currentUser: readJson(STORAGE_KEYS.currentUser),
  restaurant: null,
  categories: [],
  menuItems: [],
  deliveryZones: [],
  orders: [],
  states: [],
  citiesByState: {},
  neighborhoodsByCity: {},
  orderFilter: 'ALL',
  openingHours: []
};

const el = {};

document.addEventListener('DOMContentLoaded', init);

function init() {
  bindElements();
  bindEvents();
  updateHeader();

  if (state.accessToken) {
    bootstrapAuthenticatedArea();
  } else {
    showAuthOnly();
  }
}

function bindElements() {
  [
    'toastRoot','configModal','closeConfigBtn','apiBaseUrlInput','saveConfigBtn','testConfigBtn','configBtn',
    'headerGuest','headerUser','headerUserName','logoutBtn','authSection','dashboardSection','loginForm',
    'restaurantTitle','restaurantSubtitle','restaurantStatusBadge','restaurantCityBadge','restaurantLogo','restaurantLogoFallback',
    'openRestaurantModalBtn','openMenuModalBtn','openZoneModalBtn','openHoursModalBtn',
    'hoursModal','hoursForm','hoursGrid','resetHoursBtn','reloadOrdersBtn','orderFilterSelect','ordersList','ordersEmptyState','addCategoryShortcutBtn','addMenuItemShortcutBtn',
    'restaurantModal','restaurantForm','restaurantName','restaurantPhone','restaurantDescription','restaurantLogoUrl','restaurantAddress','restaurantStateSelect','restaurantCitySelect','restaurantMinOrder','restaurantIsActive','toggleRestaurantStatusBtn',
    'menuModal','categoriesModal','categoryEditorModal','menuEditorModal','categoryForm','categoryId','categoryName','categorySortOrder','categoryDescription','categoryImageUrl','categoryIsActive','resetCategoryFormBtn','deleteCategoryBtn','categoryList','categoryEmptyState','openCategoriesModalBtn','addCategoryFromModalBtn',
    'menuForm','menuItemId','menuName','menuPrice','menuDescription','menuImageUrl','menuCategoryId','menuSortOrder','menuPromotionalText','menuMaxPerOrder','menuAvailable','menuFeatured','menuAllowsNotes','addOptionGroupBtn','optionGroupsContainer','resetMenuFormBtn','deleteMenuItemBtn','menuList','menuEmptyState',
    'zoneModal','zoneEditorModal','addZoneFromModalBtn','zoneForm','zoneId','zoneStateSelect','zoneCitySelect','zoneNeighborhoodSelect','zoneFee','zoneMinTime','zoneMaxTime','zoneActive','resetZoneFormBtn','deleteZoneBtn','zonesList','zonesEmptyState',
    'optionGroupTemplate','choiceTemplate'
  ].forEach((id) => el[id] = document.getElementById(id));
}

function bindEvents() {
  el.closeConfigBtn.addEventListener('click', () => toggleModal('configModal', false));
  document.body.addEventListener('click', handleGlobalClicks);

  el.loginForm.addEventListener('submit', handleLogin);
  el.logoutBtn.addEventListener('click', () => logout(true));

  el.openRestaurantModalBtn.addEventListener('click', () => toggleModal('restaurantModal', true));
  el.openMenuModalBtn.addEventListener('click', () => toggleModal('menuModal', true));
  el.openZoneModalBtn.addEventListener('click', () => toggleModal('zoneModal', true));
  el.addZoneFromModalBtn?.addEventListener('click', () => {
    resetZoneForm();
    toggleModal('zoneEditorModal', true);
    el.zoneStateSelect.focus();
  });
  el.openHoursModalBtn?.addEventListener('click', () => { renderHoursForm(); toggleModal('hoursModal', true); });
  el.openCategoriesModalBtn?.addEventListener('click', () => toggleModal('categoriesModal', true));
  el.addCategoryFromModalBtn?.addEventListener('click', () => {
    resetCategoryForm();
    toggleModal('categoryEditorModal', true);
    el.categoryName.focus();
  });
  el.addMenuItemShortcutBtn?.addEventListener('click', () => {
    resetMenuForm();
    toggleModal('menuEditorModal', true);
    el.menuName.focus();
  });

  el.orderFilterSelect.addEventListener('change', () => {
    state.orderFilter = el.orderFilterSelect.value;
    renderOrders();
  });
  el.reloadOrdersBtn.addEventListener('click', loadOrders);
  el.ordersList.addEventListener('click', handleOrderActions);

  el.restaurantStateSelect.addEventListener('change', handleRestaurantStateChange);
  el.restaurantForm.addEventListener('submit', handleSaveRestaurant);
  el.toggleRestaurantStatusBtn.addEventListener('click', handleToggleRestaurantStatus);
  el.hoursForm?.addEventListener('submit', handleSaveHours);
  el.resetHoursBtn?.addEventListener('click', () => { state.openingHours = []; renderHoursForm(); });

  el.categoryForm.addEventListener('submit', handleSaveCategory);
  el.resetCategoryFormBtn.addEventListener('click', resetCategoryForm);
  el.deleteCategoryBtn.addEventListener('click', handleDeleteCategory);
  el.categoryList.addEventListener('click', handleCategoryActions);

  el.menuForm.addEventListener('submit', handleSaveMenuItem);
  el.addOptionGroupBtn.addEventListener('click', () => addOptionGroup());
  el.optionGroupsContainer.addEventListener('click', handleOptionGroupActions);
  el.resetMenuFormBtn.addEventListener('click', resetMenuForm);
  el.deleteMenuItemBtn.addEventListener('click', handleDeleteMenuItem);
  el.menuList.addEventListener('click', handleMenuListActions);

  el.zoneStateSelect.addEventListener('change', handleZoneStateChange);
  el.zoneCitySelect.addEventListener('change', handleZoneCityChange);
  el.zoneForm.addEventListener('submit', handleSaveZone);
  el.resetZoneFormBtn.addEventListener('click', resetZoneForm);
  el.deleteZoneBtn.addEventListener('click', handleDeleteZone);
  el.zonesList.addEventListener('click', handleZoneListActions);
}

function handleGlobalClicks(event) {
  const closeBtn = event.target.closest('[data-close-modal]');
  if (closeBtn) {
    toggleModal(closeBtn.dataset.closeModal, false);
    return;
  }
  const modal = event.target.classList.contains('modal') ? event.target : null;
  if (modal) toggleModal(modal.id, false);
}

function toggleModal(id, show) {
  const node = typeof id === 'string' ? document.getElementById(id) : id;
  if (!node) return;
  node.classList.toggle('hidden', !show);
}

function updateHeader() {
  const logged = Boolean(state.currentUser && state.accessToken);
  el.headerGuest.classList.toggle('hidden', logged);
  el.headerUser.classList.toggle('hidden', !logged);
  el.headerUserName.textContent = logged ? `${state.currentUser.name || state.currentUser.email}` : '';
}

function showAuthOnly() {
  el.authSection.classList.remove('hidden');
  el.dashboardSection.classList.add('hidden');
}

async function bootstrapAuthenticatedArea() {
  try {
    await loadCurrentUser();
    await loadStates();
    await loadRestaurant();
    await Promise.all([loadCatalog(), loadZones(), loadOrders()]);
    el.authSection.classList.add('hidden');
    el.dashboardSection.classList.remove('hidden');
  } catch (error) {
    showToast(error.message || 'Erro ao carregar painel.', 'error');
    if (error.status === 401) logout(false);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const formEl = event.currentTarget;
  const form = new FormData(formEl);
  try {
    const result = await apiRequest('/auth/login', { method: 'POST', body: { email: form.get('email'), password: form.get('password') } });
    applyAuth(result);
    formEl?.reset?.();
    await bootstrapAuthenticatedArea();
    showToast('Login realizado com sucesso.', 'success');
  } catch (error) {
    logout(false);
    const message = error.status === 401 || error.status === 403
      ? 'Login feito, mas esta conta não tem acesso ao painel do restaurante.'
      : (error.message || 'Falha ao entrar.');
    showToast(message, 'error');
  }
}

function applyAuth(result) {
  state.accessToken = result.accessToken || '';
  state.refreshToken = result.refreshToken || '';
  state.currentUser = normalizeUser(result.user || result.me || result);
  localStorage.setItem(STORAGE_KEYS.accessToken, state.accessToken);
  localStorage.setItem(STORAGE_KEYS.refreshToken, state.refreshToken);
  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(state.currentUser));
  updateHeader();
}

function logout(notify) {
  state.accessToken = '';
  state.refreshToken = '';
  state.currentUser = null;
  state.restaurant = null;
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.currentUser);
  localStorage.removeItem(STORAGE_KEYS.currentRestaurantId);
  updateHeader();
  showAuthOnly();
  if (notify) showToast('Sessão encerrada.', 'info');
}

async function loadCurrentUser() {
  const user = await apiRequest('/auth/me', { auth: true, retryOn401: true });
  state.currentUser = normalizeUser(user);
  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(state.currentUser));
  updateHeader();
}

async function refreshSession() {
  const refreshed = await apiRequest('/auth/refresh', {
    method: 'POST', body: { refreshToken: state.refreshToken }, retryOn401: false
  });
  applyAuth(refreshed);
}

async function loadRestaurant() {
  let owned = [];
  let lastError = null;

  try {
    owned = unwrapCollection(await apiRequest('/restaurants/my/owned', { auth: true, retryOn401: true }));
  } catch (error) {
    lastError = error;
    if (![401, 403].includes(error.status)) throw error;
  }

  let restaurant = normalizeRestaurant(findRestaurantCandidate(owned[0] || owned));

  if (!restaurant && state.currentUser?.id) {
    const publicRestaurants = unwrapCollection(await apiRequest('/restaurants', { retryOn401: false }));
    const matched = publicRestaurants.find((item) => {
      const ownerId = item?.ownerId || item?.owner?.id || item?.restaurant?.ownerId || item?.restaurant?.owner?.id;
      return ownerId === state.currentUser.id;
    });
    restaurant = normalizeRestaurant(findRestaurantCandidate(matched));
  }

  if (!restaurant) {
    if (lastError && [401, 403].includes(lastError.status)) {
      const err = new Error('Sua conta autenticou, mas não tem permissão de restaurante. Entre com uma conta RESTAURANT.');
      err.status = lastError.status;
      throw err;
    }
    throw new Error('Nenhum restaurante encontrado para esta conta.');
  }

  state.restaurant = restaurant;
  localStorage.setItem(STORAGE_KEYS.currentRestaurantId, restaurant.id);
  state.openingHours = await loadOpeningHours(restaurant.id);
  renderRestaurant();
  fillRestaurantForm();
}


async function loadOpeningHours(restaurantId) {
  if (!restaurantId) return [];
  const result = await apiRequest(`/restaurants/${restaurantId}/opening-hours`, { auth: true, retryOn401: true });
  return normalizeOpeningHours(result?.hours || result?.openingHours || result);
}

function renderHoursForm() {
  if (!el.hoursGrid) return;
  const labels = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const byDay = new Map(normalizeOpeningHours(state.openingHours).map((item) => [item.dayOfWeek, item]));
  el.hoursGrid.innerHTML = labels.map((label, day) => {
    const current = byDay.get(day);
    return `
      <div class="hour-row">
        <div class="hour-day">${label}</div>
        <label class="hour-check">
          <input type="checkbox" data-hour-enabled="${day}" ${current ? 'checked' : ''} />
          <span>Atender</span>
        </label>
        <input type="time" data-hour-open="${day}" value="${escapeAttribute(current?.openTime || '08:00')}" ${current ? '' : 'disabled'} />
        <span class="hour-sep">às</span>
        <input type="time" data-hour-close="${day}" value="${escapeAttribute(current?.closeTime || '18:00')}" ${current ? '' : 'disabled'} />
      </div>
    `;
  }).join('');

  el.hoursGrid.querySelectorAll('[data-hour-enabled]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const day = checkbox.dataset.hourEnabled;
      const open = el.hoursGrid.querySelector(`[data-hour-open="${day}"]`);
      const close = el.hoursGrid.querySelector(`[data-hour-close="${day}"]`);
      if (open) open.disabled = !checkbox.checked;
      if (close) close.disabled = !checkbox.checked;
    });
  });
}

async function handleSaveHours(event) {
  event.preventDefault();
  const restaurantId = getRestaurantId();
  if (!restaurantId) return;
  const hours = [...el.hoursGrid.querySelectorAll('[data-hour-enabled]')]
    .filter((input) => input.checked)
    .map((input) => {
      const day = Number(input.dataset.hourEnabled);
      const open = el.hoursGrid.querySelector(`[data-hour-open="${day}"]`)?.value || '';
      const close = el.hoursGrid.querySelector(`[data-hour-close="${day}"]`)?.value || '';
      return { dayOfWeek: day, openTime: open, closeTime: close };
    })
    .filter((item) => item.openTime && item.closeTime);

  for (const item of hours) {
    if (item.closeTime === item.openTime) {
      showToast('Abertura e fechamento não podem ser iguais.', 'error');
      return;
    }
  }

  const normalized = normalizeOpeningHours(hours);
  const payloadHours = normalized.map(({ dayOfWeek, openTime, closeTime }) => ({ dayOfWeek, openTime, closeTime }));

  try {
    const saved = await apiRequest(`/restaurants/${restaurantId}/opening-hours`, {
      method: 'PATCH',
      auth: true,
      retryOn401: true,
      body: { hours: payloadHours }
    });
    state.openingHours = normalizeOpeningHours(saved?.hours || saved?.openingHours || saved);
    if (state.restaurant) state.restaurant.hours = state.openingHours;
    renderRestaurant();
    toggleModal('hoursModal', false);
    showToast('Horários salvos na API com sucesso.', 'success');
  } catch (error) {
    showToast(error.message || 'Não foi possível salvar os horários na API.', 'error');
  }
}

function normalizeOpeningHours(items) {
  return unwrapCollection(items).map((item) => ({
    id: item.id || '',
    dayOfWeek: Number(item.dayOfWeek),
    openTime: normalizeTime(item.openTime),
    closeTime: normalizeTime(item.closeTime)
  })).filter((item) => Number.isInteger(item.dayOfWeek) && item.dayOfWeek >= 0 && item.dayOfWeek <= 6 && item.openTime && item.closeTime)
    .sort((a, b) => (a.dayOfWeek - b.dayOfWeek) || a.openTime.localeCompare(b.openTime));
}

function normalizeTime(value) {
  const raw = String(value || '').trim();
  const match = raw.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return '';
  return `${match[1].padStart(2, '0')}:${match[2]}`;
}

function getRestaurantOpenInfo(hours, isActive = true) {
  if (!isActive) return { isOpen: false, statusLabel: 'Inativo', todayLabel: 'Restaurante desativado' };
  const normalized = normalizeOpeningHours(hours);
  if (!normalized.length) return { isOpen: true, statusLabel: 'Aberto', todayLabel: 'Horário não informado' };
  const now = new Date();
  const today = normalized.filter((item) => item.dayOfWeek === now.getDay());
  if (!today.length) return { isOpen: false, statusLabel: 'Fechado', todayLabel: 'Hoje: fechado' };
  const nowMinutes = (now.getHours() * 60) + now.getMinutes();
  for (const slot of today) {
    const open = slot.openTime.split(':').map(Number);
    const close = slot.closeTime.split(':').map(Number);
    const openMin = open[0] * 60 + open[1];
    const closeMin = close[0] * 60 + close[1];
    const inside = closeMin >= openMin ? (nowMinutes >= openMin && nowMinutes < closeMin) : (nowMinutes >= openMin || nowMinutes < closeMin);
    if (inside) return { isOpen: true, statusLabel: 'Aberto', todayLabel: `Hoje: ${slot.openTime} às ${slot.closeTime}` };
  }
  return { isOpen: false, statusLabel: 'Fechado', todayLabel: `Hoje: ${today[0].openTime} às ${today[0].closeTime}` };
}

async function loadCatalog() {
  const restaurantId = getRestaurantId();
  if (!restaurantId) return;
  const [categoriesRes, catalogRes] = await Promise.all([
    apiRequest(`/menu/restaurant/${restaurantId}/categories`, { auth: true, retryOn401: true }),
    apiRequest(`/menu/restaurant/${restaurantId}/catalog?onlyAvailable=false`, { auth: true, retryOn401: true })
  ]);
  state.categories = unwrapCollection(categoriesRes).map(normalizeCategory).filter(Boolean).sort(sortByOrder);

  const rawCatalog = unwrapCollection(catalogRes);
  if (rawCatalog.length && (rawCatalog[0]?.items || rawCatalog[0]?.menuItems)) {
    state.menuItems = rawCatalog
      .flatMap((category) => {
        const categoryItems = category.items || category.menuItems || [];
        return categoryItems.map((item) => normalizeMenuItem({ ...item, category }));
      })
      .filter(Boolean)
      .sort(sortByOrder);
  } else {
    state.menuItems = rawCatalog.map(normalizeMenuItem).filter(Boolean).sort(sortByOrder);
  }
  fillCategorySelect();
  renderCategories();
  renderMenuItems();
}

async function loadZones() {
  const restaurantId = getRestaurantId();
  if (!restaurantId) return;
  const zones = await apiRequest(`/restaurant-delivery-zones/restaurant/${restaurantId}`, { auth: true, retryOn401: true });
  state.deliveryZones = unwrapCollection(zones).map(normalizeZone).filter(Boolean);
  renderZones();
}

async function loadOrders() {
  const restaurantId = getRestaurantId();
  if (!restaurantId) return;
  const orders = await apiRequest(`/orders/restaurant/${restaurantId}`, { auth: true, retryOn401: true });
  state.orders = unwrapCollection(orders).map(normalizeOrder).filter(Boolean);
  renderOrders();
}

async function loadStates() {
  state.states = unwrapCollection(await apiRequest('/locations/states')).map((item) => ({ id: item.id, name: item.name, code: item.code }));
  const baseOptions = [{ value: '', label: 'Selecione' }, ...state.states.map((item) => ({ value: item.id, label: `${item.name} (${item.code})` }))];
  fillSelect(el.restaurantStateSelect, baseOptions);
  fillSelect(el.zoneStateSelect, baseOptions);
}

async function loadCitiesByState(stateId) {
  if (!stateId) return [];
  if (!state.citiesByState[stateId]) {
    state.citiesByState[stateId] = unwrapCollection(await apiRequest(`/locations/states/${stateId}/cities`));
  }
  return state.citiesByState[stateId];
}

async function loadNeighborhoodsByCity(cityId) {
  if (!cityId) return [];
  if (!state.neighborhoodsByCity[cityId]) {
    state.neighborhoodsByCity[cityId] = unwrapCollection(await apiRequest(`/locations/cities/${cityId}/neighborhoods`));
  }
  return state.neighborhoodsByCity[cityId];
}

async function handleRestaurantStateChange() {
  const stateId = el.restaurantStateSelect.value;
  const cities = await loadCitiesByState(stateId);
  fillSelect(el.restaurantCitySelect, [{ value: '', label: 'Selecione' }, ...cities.map((item) => ({ value: item.id, label: item.name }))]);
}

async function handleZoneStateChange() {
  const stateId = el.zoneStateSelect.value;
  const cities = await loadCitiesByState(stateId);
  fillSelect(el.zoneCitySelect, [{ value: '', label: 'Selecione' }, ...cities.map((item) => ({ value: item.id, label: item.name }))]);
  fillSelect(el.zoneNeighborhoodSelect, [{ value: '', label: 'Selecione' }]);
}

async function handleZoneCityChange() {
  const cityId = el.zoneCitySelect.value;
  const neighborhoods = await loadNeighborhoodsByCity(cityId);
  fillSelect(el.zoneNeighborhoodSelect, [{ value: '', label: 'Selecione' }, ...neighborhoods.map((item) => ({ value: item.id, label: item.name }))]);
}

function renderRestaurant() {
  const restaurant = state.restaurant;
  if (!restaurant) return;
  el.restaurantTitle.textContent = restaurant.name || 'Restaurante';
  const openInfo = getRestaurantOpenInfo(state.openingHours, restaurant.isActive);
  el.restaurantSubtitle.textContent = [restaurant.description, restaurant.phone, restaurant.address, openInfo.todayLabel].filter(Boolean).join(' • ');
  el.restaurantStatusBadge.textContent = openInfo.statusLabel;
  el.restaurantStatusBadge.className = `badge ${openInfo.isOpen ? 'success-badge' : 'danger-badge'}`;
  el.restaurantCityBadge.textContent = restaurant.cityName || 'Cidade não informada';
  const logo = restaurant.logoUrl || '';
  el.restaurantLogo.classList.toggle('hidden', !logo);
  el.restaurantLogoFallback.classList.toggle('hidden', Boolean(logo));
  if (logo) el.restaurantLogo.src = logo;
}

function fillRestaurantForm() {
  const restaurant = state.restaurant;
  if (!restaurant) return;
  el.restaurantName.value = restaurant.name || '';
  el.restaurantPhone.value = restaurant.phone || '';
  el.restaurantDescription.value = restaurant.description || '';
  el.restaurantLogoUrl.value = restaurant.logoUrl || '';
  el.restaurantAddress.value = restaurant.address || '';
  el.restaurantMinOrder.value = restaurant.minOrder ?? '';
  el.restaurantIsActive.checked = Boolean(restaurant.isActive);

  const stateId = restaurant.stateId || restaurant.city?.state?.id || '';
  el.restaurantStateSelect.value = stateId;
  handleRestaurantStateChange().then(() => {
    el.restaurantCitySelect.value = restaurant.cityId || '';
  });
}

function fillCategorySelect() {
  fillSelect(el.menuCategoryId, [{ value: '', label: 'Sem categoria' }, ...state.categories.map((item) => ({ value: item.id, label: item.name }))]);
}

function renderCategories() {
  el.categoryList.innerHTML = '';
  el.categoryEmptyState.classList.toggle('hidden', state.categories.length > 0);
  state.categories.forEach((category) => {
    const count = state.menuItems.filter((item) => item.categoryId === category.id).length;
    const card = document.createElement('div');
    card.className = 'list-card category-card';
    card.innerHTML = `
      <div class="list-card-top">
        <div>
          <h4>${escapeHtml(category.name)}</h4>
          <p>${escapeHtml(category.description || 'Sem descrição')}</p>
          <div class="meta-row">
            <span class="tag">Ordem ${category.sortOrder || 0}</span>
            <span class="tag">${count} item(ns)</span>
            <span class="tag ${category.isActive ? 'tag-ok' : 'tag-off'}">${category.isActive ? 'Ativa' : 'Inativa'}</span>
          </div>
        </div>
        <button class="ghost-btn small" type="button" data-edit-category="${category.id}">Editar</button>
      </div>`;
    el.categoryList.appendChild(card);
  });
}

function renderMenuItems() {
  el.menuList.innerHTML = '';
  const sortedCategories = [...state.categories].sort(sortByOrder);
  const uncategorized = state.menuItems.filter((item) => !item.categoryId).sort(sortByOrder);
  const groups = sortedCategories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    sortOrder: category.sortOrder,
    items: state.menuItems.filter((item) => item.categoryId === category.id).sort(sortByOrder)
  })).filter((group) => group.items.length > 0);
  if (uncategorized.length) groups.push({ id: '', name: 'Sem categoria', description: 'Itens sem categoria definida', sortOrder: 999999, items: uncategorized });
  groups.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name));

  el.menuEmptyState.classList.toggle('hidden', groups.length > 0);
  groups.forEach((group) => {
    const section = document.createElement('section');
    section.className = 'menu-category-section customer-style-section';
    const description = group.description ? `<p class="muted small">${escapeHtml(group.description)}</p>` : '';
    section.innerHTML = `
      <div class="customer-category-header">
        <div>
          <h4>${escapeHtml(group.name)}</h4>
          ${description}
        </div>
      </div>
      <div class="client-menu-list vertical-stack"></div>
    `;
    const list = section.querySelector('.client-menu-list');

    group.items.forEach((item) => {
      const itemCard = document.createElement('article');
      itemCard.className = 'client-menu-item customer-line-item';
      const image = item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" />` : `<div class="client-menu-image-fallback">${escapeHtml((item.name || 'Item').slice(0, 2).toUpperCase())}</div>`;
      const groupsMeta = (item.options || []).length ? `<div class="meta-row wrap">${item.options.map((group) => `<span class="tag">${escapeHtml(group.name)} · ${group.minSelect ?? 0} a ${group.maxSelect ?? '-'} · ${group.choices?.length || 0} opções</span>`).join('')}</div>` : '';
      itemCard.innerHTML = `
        <div class="customer-line-main">
          <div class="client-menu-image left-thumb">${image}</div>
          <div class="customer-line-content">
            <h5>${escapeHtml(item.name)}</h5>
            <div class="small">${escapeHtml(item.description || 'Sem descrição')}</div>
            <div class="meta-row wrap">
              <span class="tag ${item.isAvailable ? 'tag-ok' : 'tag-off'}">${item.isAvailable ? 'Disponível' : 'Indisponível'}</span>
              <span class="tag">Ordem ${item.sortOrder || 0}</span>
              ${item.isFeatured ? '<span class="tag">Destaque</span>' : ''}
              ${item.promotionalText ? `<span class="tag tag-ok">${escapeHtml(item.promotionalText)}</span>` : ''}
            </div>
            ${groupsMeta}
          </div>
          <div class="customer-line-right">
            <div class="menu-item-price">${formatMoney(item.price)}</div>
            <button class="ghost-btn small" type="button" data-edit-menu-item="${item.id}">Editar item</button>
          </div>
        </div>
      `;
      list.appendChild(itemCard);
    });

    el.menuList.appendChild(section);
  });
}

function renderZones() {
  el.zonesList.innerHTML = '';
  el.zonesEmptyState.classList.toggle('hidden', state.deliveryZones.length > 0);
  state.deliveryZones.forEach((zone) => {
    const card = document.createElement('div');
    card.className = 'list-card';
    card.innerHTML = `
      <div class="list-card-top">
        <div>
          <h4>${escapeHtml(zone.neighborhoodName || 'Bairro')}</h4>
          <p>${escapeHtml(zone.cityName || '')}</p>
        </div>
        <button class="ghost-btn small" type="button" data-edit-zone="${zone.id}">Editar</button>
      </div>
      <div class="meta-row">
        <span class="tag">Taxa ${formatMoney(zone.deliveryFee)}</span>
        <span class="tag">${zone.minTime} a ${zone.maxTime} min</span>
        <span class="tag ${zone.isActive ? 'tag-ok' : 'tag-off'}">${zone.isActive ? 'Ativa' : 'Inativa'}</span>
      </div>`;
    el.zonesList.appendChild(card);
  });
}

function renderOrders() {
  const orders = state.orders.filter((item) => state.orderFilter === 'ALL' || item.status === state.orderFilter);
  el.ordersList.innerHTML = '';
  el.ordersEmptyState.classList.toggle('hidden', orders.length > 0);

  orders.forEach((order) => {
    const availableStatus = ORDER_STATUS_FLOW[order.status] || [];
    const itemsHtml = (order.items || []).map((item) => {
      const selections = (item.selections || []).map((selection) => `${escapeHtml(selection.optionName)}: ${escapeHtml(selection.choiceName)}${selection.price ? ` (+${formatMoney(selection.price)})` : ''}`).join('<br>');
      return `<li><strong>${item.quantity}x ${escapeHtml(item.name)}</strong> — ${formatMoney(item.totalPrice)}${selections ? `<div class="small muted">${selections}</div>` : ''}${item.notes ? `<div class="small muted">Obs.: ${escapeHtml(item.notes)}</div>` : ''}</li>`;
    }).join('');

    const buttons = availableStatus.map((status) => `<button class="ghost-btn small" type="button" data-next-order-status="${status}" data-order-id="${order.id}">${STATUS_LABELS[status] || status}</button>`).join('');
    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
      <div class="order-header">
        <div>
          <h4>Pedido #${escapeHtml(shortId(order.id))}</h4>
          <p class="muted">${escapeHtml(order.deliveryName || 'Cliente')} • ${escapeHtml(order.deliveryPhone || '')}</p>
        </div>
        <div class="order-header-right">
          <span class="tag ${order.status === 'CANCELED' ? 'tag-off' : 'tag-ok'}">${STATUS_LABELS[order.status] || order.status}</span>
          <strong>${formatMoney(order.total)}</strong>
        </div>
      </div>
      <div class="order-meta">
        <span>${escapeHtml(order.paymentMethodLabel)}</span>
        <span>${escapeHtml(order.deliveryStreet || '')}, ${escapeHtml(order.deliveryNumber || '')}</span>
        <span>${escapeHtml(order.deliveryDistrict || '')}</span>
      </div>
      <ul class="order-items">${itemsHtml}</ul>
      ${order.notes ? `<div class="note-box">Obs. do pedido: ${escapeHtml(order.notes)}</div>` : ''}
      <div class="order-actions">${buttons || '<span class="muted small">Sem próximas ações</span>'}</div>`;
    el.ordersList.appendChild(card);
  });
}

async function handleSaveRestaurant(event) {
  event.preventDefault();
  const restaurantId = getRestaurantId();
  if (!restaurantId) return;
  const payload = cleanObject({
    name: el.restaurantName.value.trim(),
    phone: emptyToUndefined(el.restaurantPhone.value),
    description: emptyToUndefined(el.restaurantDescription.value),
    logoUrl: emptyToUndefined(el.restaurantLogoUrl.value),
    address: el.restaurantAddress.value.trim(),
    cityId: emptyToUndefined(el.restaurantCitySelect.value),
    minOrder: numberOrUndefined(el.restaurantMinOrder.value),
    isActive: el.restaurantIsActive.checked
  });
  try {
    const updated = await apiRequest(`/restaurants/${restaurantId}`, { method: 'PATCH', auth: true, body: payload, retryOn401: true });
    state.restaurant = normalizeRestaurant(updated);
    renderRestaurant();
    showToast('Dados alterados com sucesso.', 'success');
    toggleModal('restaurantModal', false);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function handleToggleRestaurantStatus() {
  const restaurantId = getRestaurantId();
  if (!restaurantId) return;
  try {
    const updated = await apiRequest(`/restaurants/${restaurantId}/status`, {
      method: 'PATCH', auth: true, retryOn401: true, body: { isActive: !state.restaurant.isActive }
    });
    state.restaurant = normalizeRestaurant(updated);
    fillRestaurantForm();
    renderRestaurant();
    showToast('Status do restaurante atualizado.', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function handleSaveCategory(event) {
  event.preventDefault();
  const categoryId = el.categoryId.value;
  const restaurantId = getRestaurantId();
  const basePayload = cleanObject({
    name: el.categoryName.value.trim(),
    description: emptyToUndefined(el.categoryDescription.value),
    imageUrl: emptyToUndefined(el.categoryImageUrl.value),
    sortOrder: integerOrUndefined(el.categorySortOrder.value),
    isActive: el.categoryIsActive.checked
  });
  const payload = categoryId ? basePayload : { restaurantId, ...basePayload };
  const method = categoryId ? 'PATCH' : 'POST';
  const path = categoryId ? `/menu/categories/${categoryId}` : '/menu/categories';
  try {
    await apiRequest(path, { method, auth: true, retryOn401: true, body: payload });
    resetCategoryForm();
    await loadCatalog();
    toggleModal('categoryEditorModal', false);
    showToast('Categoria salva com sucesso.', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function handleCategoryActions(event) {
  const btn = event.target.closest('[data-edit-category]');
  if (!btn) return;
  const category = state.categories.find((item) => item.id === btn.dataset.editCategory);
  if (!category) return;
  el.categoryId.value = category.id;
  el.categoryName.value = category.name || '';
  el.categorySortOrder.value = category.sortOrder ?? '';
  el.categoryDescription.value = category.description || '';
  el.categoryImageUrl.value = category.imageUrl || '';
  el.categoryIsActive.checked = Boolean(category.isActive);
  el.deleteCategoryBtn.classList.remove('hidden');
  toggleModal('categoryEditorModal', true);
}

async function handleDeleteCategory() {
  const id = el.categoryId.value;
  if (!id) return;
  try {
    await apiRequest(`/menu/categories/${id}`, { method: 'DELETE', auth: true, retryOn401: true });
    resetCategoryForm();
    await loadCatalog();
    toggleModal('categoryEditorModal', false);
    showToast('Categoria excluída.', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function resetCategoryForm() {
  el.categoryForm.reset();
  el.categoryId.value = '';
  el.categoryIsActive.checked = true;
  el.deleteCategoryBtn.classList.add('hidden');
}

async function handleSaveMenuItem(event) {
  event.preventDefault();
  const menuItemId = el.menuItemId.value;
  const restaurantId = getRestaurantId();
  const basePayload = cleanObject({
    categoryId: el.menuCategoryId.value || undefined,
    name: el.menuName.value.trim(),
    price: Number(el.menuPrice.value),
    description: emptyToUndefined(el.menuDescription.value),
    imageUrl: emptyToUndefined(el.menuImageUrl.value),
    sortOrder: integerOrUndefined(el.menuSortOrder.value),
    isAvailable: el.menuAvailable.checked,
    isFeatured: el.menuFeatured.checked,
    promotionalText: emptyToUndefined(el.menuPromotionalText.value),
    allowsItemNotes: el.menuAllowsNotes.checked,
    maxPerOrder: integerOrUndefined(el.menuMaxPerOrder.value),
    options: collectOptionGroups()
  });
  const payload = menuItemId ? basePayload : { restaurantId, ...basePayload };
  const method = menuItemId ? 'PATCH' : 'POST';
  const path = menuItemId ? `/menu/${menuItemId}` : '/menu';
  try {
    await apiRequest(path, { method, auth: true, retryOn401: true, body: payload });
    resetMenuForm();
    await loadCatalog();
    toggleModal('menuEditorModal', false);
    showToast('Item salvo com sucesso.', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function handleMenuListActions(event) {
  const addBtn = event.target.closest('[data-add-product-to-category]');
  if (addBtn) {
    resetMenuForm();
    el.menuCategoryId.value = addBtn.dataset.addProductToCategory || '';
    toggleModal('menuEditorModal', true);
    el.menuName.focus();
    return;
  }
  const btn = event.target.closest('[data-edit-menu-item]');
  if (!btn) return;
  const item = state.menuItems.find((entry) => entry.id === btn.dataset.editMenuItem);
  if (!item) return;
  fillMenuForm(item);
  toggleModal('menuEditorModal', true);
}

async function handleDeleteMenuItem() {
  const id = el.menuItemId.value;
  if (!id) return;
  try {
    await apiRequest(`/menu/${id}`, { method: 'DELETE', auth: true, retryOn401: true });
    resetMenuForm();
    await loadCatalog();
    toggleModal('menuEditorModal', false);
    showToast('Item excluído.', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function resetMenuForm() {
  el.menuForm.reset();
  el.menuItemId.value = '';
  el.optionGroupsContainer.innerHTML = '';
  el.menuAvailable.checked = true;
  el.menuAllowsNotes.checked = true;
  el.deleteMenuItemBtn.classList.add('hidden');
}

function fillMenuForm(item) {
  el.menuItemId.value = item.id;
  el.menuName.value = item.name || '';
  el.menuPrice.value = item.price ?? '';
  el.menuDescription.value = item.description || '';
  el.menuImageUrl.value = item.imageUrl || '';
  el.menuCategoryId.value = item.categoryId || '';
  el.menuSortOrder.value = item.sortOrder ?? '';
  el.menuPromotionalText.value = item.promotionalText || '';
  el.menuMaxPerOrder.value = item.maxPerOrder ?? '';
  el.menuAvailable.checked = Boolean(item.isAvailable);
  el.menuFeatured.checked = Boolean(item.isFeatured);
  el.menuAllowsNotes.checked = item.allowsItemNotes !== false;
  el.optionGroupsContainer.innerHTML = '';
  (item.options || []).forEach((group) => addOptionGroup(group));
  el.deleteMenuItemBtn.classList.remove('hidden');
}

function addOptionGroup(group = {}) {
  const node = el.optionGroupTemplate.content.firstElementChild.cloneNode(true);
  node.querySelector('[data-option-name]').value = group.name || '';
  node.querySelector('[data-option-type]').value = group.optionType || 'ADDITION';
  node.querySelector('[data-option-description]').value = group.description || '';
  node.querySelector('[data-option-min]').value = group.minSelect ?? '';
  node.querySelector('[data-option-max]').value = group.maxSelect ?? '';
  node.querySelector('[data-option-sort]').value = group.sortOrder ?? '';
  node.querySelector('[data-option-required]').checked = Boolean(group.required);
  node.querySelector('[data-option-active]').checked = group.isActive !== false;
  const choicesList = node.querySelector('[data-choices-list]');
  (group.choices || []).forEach((choice) => addChoice(choicesList, choice));
  if (!(group.choices || []).length) addChoice(choicesList);
  el.optionGroupsContainer.appendChild(node);
}

function addChoice(container, choice = {}) {
  const row = el.choiceTemplate.content.firstElementChild.cloneNode(true);
  row.querySelector('[data-choice-name]').value = choice.name || '';
  row.querySelector('[data-choice-price]').value = choice.price ?? '';
  row.querySelector('[data-choice-description]').value = choice.description || '';
  row.querySelector('[data-choice-default]').checked = Boolean(choice.isDefault);
  container.appendChild(row);
}

function handleOptionGroupActions(event) {
  const removeGroup = event.target.closest('[data-remove-option-group]');
  if (removeGroup) {
    removeGroup.closest('[data-option-group]')?.remove();
    return;
  }
  const addChoiceBtn = event.target.closest('[data-add-choice]');
  if (addChoiceBtn) {
    const box = addChoiceBtn.closest('[data-option-group]');
    addChoice(box.querySelector('[data-choices-list]'));
    return;
  }
  const removeChoice = event.target.closest('[data-remove-choice]');
  if (removeChoice) {
    const list = removeChoice.closest('[data-choices-list]');
    removeChoice.closest('[data-choice]')?.remove();
    if (!list.children.length) addChoice(list);
  }
}

function collectOptionGroups() {
  return Array.from(el.optionGroupsContainer.querySelectorAll('[data-option-group]')).map((node) => {
    const choices = Array.from(node.querySelectorAll('[data-choice]')).map((choiceNode, index) => ({
      name: choiceNode.querySelector('[data-choice-name]').value.trim(),
      price: numberOrUndefined(choiceNode.querySelector('[data-choice-price]').value),
      description: emptyToUndefined(choiceNode.querySelector('[data-choice-description]').value),
      sortOrder: index,
      isDefault: choiceNode.querySelector('[data-choice-default]').checked,
      isActive: true
    })).filter((choice) => choice.name);

    return {
      name: node.querySelector('[data-option-name]').value.trim(),
      optionType: node.querySelector('[data-option-type]').value,
      description: emptyToUndefined(node.querySelector('[data-option-description]').value),
      minSelect: integerOrUndefined(node.querySelector('[data-option-min]').value),
      maxSelect: integerOrUndefined(node.querySelector('[data-option-max]').value),
      sortOrder: integerOrUndefined(node.querySelector('[data-option-sort]').value),
      required: node.querySelector('[data-option-required]').checked,
      isActive: node.querySelector('[data-option-active]').checked,
      choices
    };
  }).filter((group) => group.name && group.choices.length);
}

async function handleSaveZone(event) {
  event.preventDefault();
  const id = el.zoneId.value;
  const payload = {
    restaurantId: getRestaurantId(),
    neighborhoodId: el.zoneNeighborhoodSelect.value,
    deliveryFee: Number(el.zoneFee.value),
    minTime: Number(el.zoneMinTime.value),
    maxTime: Number(el.zoneMaxTime.value),
    isActive: el.zoneActive.checked
  };
  const method = id ? 'PATCH' : 'POST';
  const path = id ? `/restaurant-delivery-zones/${id}` : '/restaurant-delivery-zones';
  try {
    await apiRequest(path, { method, auth: true, retryOn401: true, body: payload });
    resetZoneForm();
    await loadZones();
    toggleModal('zoneEditorModal', false);
    showToast('Zona salva.', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function handleZoneListActions(event) {
  const btn = event.target.closest('[data-edit-zone]');
  if (!btn) return;
  const zone = state.deliveryZones.find((item) => item.id === btn.dataset.editZone);
  if (!zone) return;
  fillZoneForm(zone);
}

async function handleDeleteZone() {
  const id = el.zoneId.value;
  if (!id) return;
  try {
    await apiRequest(`/restaurant-delivery-zones/${id}`, { method: 'DELETE', auth: true, retryOn401: true });
    resetZoneForm();
    await loadZones();
    toggleModal('zoneEditorModal', false);
    showToast('Zona excluída.', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function fillZoneForm(zone) {
  el.zoneId.value = zone.id;
  el.zoneFee.value = zone.deliveryFee ?? '';
  el.zoneMinTime.value = zone.minTime ?? '';
  el.zoneMaxTime.value = zone.maxTime ?? '';
  el.zoneActive.checked = Boolean(zone.isActive);

  el.zoneStateSelect.value = zone.stateId || '';
  handleZoneStateChange().then(() => {
    el.zoneCitySelect.value = zone.cityId || '';
    return handleZoneCityChange();
  }).then(() => {
    el.zoneNeighborhoodSelect.value = zone.neighborhoodId || '';
  });
  el.deleteZoneBtn.classList.remove('hidden');
  toggleModal('zoneEditorModal', true);
}

function resetZoneForm() {
  el.zoneForm.reset();
  el.zoneId.value = '';
  el.zoneActive.checked = true;
  el.deleteZoneBtn.classList.add('hidden');
}

async function handleOrderActions(event) {
  const button = event.target.closest('[data-next-order-status]');
  if (!button) return;
  try {
    await apiRequest(`/orders/${button.dataset.orderId}/status`, {
      method: 'PATCH', auth: true, retryOn401: true, body: { status: button.dataset.nextOrderStatus }
    });
    await loadOrders();
    showToast('Pedido atualizado.', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function getRestaurantId() {
  return extractUuid(state.restaurant?.id)
    || extractUuid(state.restaurant?.restaurantId)
    || extractUuid(localStorage.getItem(STORAGE_KEYS.currentRestaurantId))
    || '';
}

function findRestaurantCandidate(input) {
  if (!input) return input;
  if (Array.isArray(input)) return findRestaurantCandidate(input[0]);
  return input.restaurant || input.data?.restaurant || input;
}

async function apiRequest(path, options = {}) {
  const { method = 'GET', body, auth = false, retryOn401 = false } = options;
  const headers = { 'Content-Type': 'application/json', 'X-Target-Base-Url': state.apiBaseUrl };
  if (auth && state.accessToken) headers.Authorization = `Bearer ${state.accessToken}`;

  const response = await fetch(`/proxy${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await response.text();
  const raw = text ? safeJsonParse(text) : null;

  if ((response.status === 401 || response.status === 403) && retryOn401 && state.refreshToken) {
    await refreshSession();
    return apiRequest(path, { ...options, retryOn401: false, auth });
  }

  if (!response.ok) {
    const error = new Error(extractErrorMessage(raw) || `Erro ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return unwrapPayload(raw);
}


function unwrapPayload(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return input;
  if ('success' in input && 'data' in input) return input.data;
  return input;
}

function unwrapCollection(input) {
  if (Array.isArray(input)) return input;
  if (!input || typeof input !== 'object') return [];
  for (const key of ['data', 'items', 'results', 'restaurants', 'orders', 'categories']) {
    if (Array.isArray(input[key])) return input[key];
  }
  return [];
}

function normalizeUser(user) {
  if (!user || typeof user !== 'object') return null;
  return { id: user.id || user.userId || '', name: user.name || '', email: user.email || '', role: user.role || '' };
}

function normalizeRestaurant(item) {
  if (!item) return null;
  const source = findRestaurantCandidate(item);
  return {
    id: extractUuid(source.id) || extractUuid(source.restaurantId) || '',
    restaurantId: extractUuid(source.restaurantId) || extractUuid(source.id) || '',
    name: source.name,
    description: source.description,
    logoUrl: source.logoUrl,
    phone: source.phone,
    address: source.address,
    cityId: source.cityId || source.city?.id || '',
    cityName: source.city?.name || source.cityName || '',
    stateId: source.city?.state?.id || source.stateId || '',
    minOrder: decimalToNumber(source.minOrder),
    isActive: Boolean(source.isActive),
    city: source.city || null,
    hours: normalizeOpeningHours(source.hours || source.openingHours || [])
  };
}

function normalizeCategory(item) {
  if (!item) return null;
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    imageUrl: item.imageUrl,
    sortOrder: item.sortOrder || 0,
    isActive: item.isActive !== false
  };
}

function normalizeMenuItem(item) {
  if (!item) return null;
  const category = item.category || {};
  return {
    id: item.id,
    categoryId: item.categoryId || category.id || '',
    categoryName: category.name || item.categoryName || '',
    name: item.name,
    description: item.description,
    price: decimalToNumber(item.price),
    imageUrl: item.imageUrl,
    isAvailable: item.isAvailable !== false,
    sortOrder: item.sortOrder || 0,
    isFeatured: Boolean(item.isFeatured),
    promotionalText: item.promotionalText,
    allowsItemNotes: item.allowsItemNotes !== false,
    maxPerOrder: item.maxPerOrder,
    options: Array.isArray(item.options) ? item.options.map((option) => ({
      id: option.id,
      name: option.name,
      description: option.description,
      optionType: option.optionType,
      required: Boolean(option.required),
      minSelect: option.minSelect,
      maxSelect: option.maxSelect,
      sortOrder: option.sortOrder || 0,
      isActive: option.isActive !== false,
      choices: Array.isArray(option.choices) ? option.choices.map((choice) => ({
        id: choice.id,
        name: choice.name,
        description: choice.description,
        price: decimalToNumber(choice.price),
        isDefault: Boolean(choice.isDefault)
      })) : []
    })) : []
  };
}

function normalizeZone(item) {
  if (!item) return null;
  return {
    id: item.id,
    neighborhoodId: item.neighborhoodId || item.neighborhood?.id || '',
    neighborhoodName: item.neighborhood?.name || item.neighborhoodName || '',
    cityId: item.neighborhood?.city?.id || item.cityId || '',
    cityName: item.neighborhood?.city?.name || item.cityName || '',
    stateId: item.neighborhood?.city?.state?.id || item.stateId || '',
    deliveryFee: decimalToNumber(item.deliveryFee),
    minTime: item.minTime,
    maxTime: item.maxTime,
    isActive: item.isActive !== false
  };
}

function normalizeOrder(item) {
  if (!item) return null;
  return {
    id: item.id,
    status: item.status,
    paymentMethod: item.paymentMethod,
    paymentMethodLabel: paymentMethodLabel(item.paymentMethod),
    total: decimalToNumber(item.total),
    notes: item.notes,
    deliveryName: item.deliveryName,
    deliveryPhone: item.deliveryPhone,
    deliveryStreet: item.deliveryStreet,
    deliveryNumber: item.deliveryNumber,
    deliveryDistrict: item.deliveryDistrict,
    items: Array.isArray(item.items) ? item.items.map((orderItem) => ({
      quantity: orderItem.quantity,
      name: orderItem.name,
      totalPrice: decimalToNumber(orderItem.totalPrice),
      notes: orderItem.notes,
      selections: Array.isArray(orderItem.selections) ? orderItem.selections.map((selection) => ({
        optionName: selection.optionName,
        choiceName: selection.choiceName,
        price: decimalToNumber(selection.price)
      })) : []
    })) : []
  };
}

function paymentMethodLabel(value) {
  const labels = { CASH: 'Dinheiro', PIX: 'PIX', CREDIT_CARD: 'Cartão de crédito', DEBIT_CARD: 'Cartão de débito' };
  return labels[value] || value || 'Não informado';
}

function fillSelect(select, items) {
  select.innerHTML = items.map((item) => `<option value="${escapeHtml(String(item.value))}">${escapeHtml(item.label)}</option>`).join('');
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  el.toastRoot.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function readJson(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}

function safeJsonParse(text) { try { return JSON.parse(text); } catch { return text; } }
function cleanObject(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
}
function extractUuid(value) {
  const text = String(value || '');
  const match = text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
  return match ? match[0] : '';
}

function extractErrorMessage(data) { return data?.message || data?.error || (Array.isArray(data?.message) ? data.message.join(', ') : 'Erro na requisição'); }
function emptyToUndefined(value) { const v = String(value || '').trim(); return v ? v : undefined; }
function integerOrUndefined(value) { if (value === '' || value == null) return undefined; return Number.parseInt(value, 10); }
function numberOrUndefined(value) { if (value === '' || value == null) return undefined; return Number(value); }
function decimalToNumber(value) { return value == null || value === '' ? null : Number(value); }
function formatMoney(value) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0)); }
function shortId(value) { return String(value || '').slice(0, 8); }
function sortByOrder(a, b) { return (a.sortOrder || 0) - (b.sortOrder || 0) || String(a.name || '').localeCompare(String(b.name || '')); }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
function escapeAttribute(value) { return escapeHtml(value); }
