const STORAGE_KEYS = {
  accessToken: 'delivery_user_access_token',
  refreshToken: 'delivery_user_refresh_token',
  currentUser: 'delivery_user_current_user',
  apiBaseUrl: 'delivery_user_api_base_url'
};

const state = {
  accessToken: localStorage.getItem(STORAGE_KEYS.accessToken) || '',
  refreshToken: localStorage.getItem(STORAGE_KEYS.refreshToken) || '',
  currentUser: readJson(STORAGE_KEYS.currentUser),
  addresses: [],
  selectedAddressId: '',
  selectedRestaurant: null,
  restaurants: [],
  restaurantBuckets: { available: [], closed: [], cityOnly: [] },
  categories: [],
  catalog: null,
  cart: [],
  deliveryFee: 0,
  currentQuote: null,
  currentItem: null,
  currentView: 'list',
  states: [],
  cities: [],
  neighborhoods: [],
  editingAddressId: null,
  authMode: 'login',
  orders: [],
  restaurantHoursById: {}
};

const el = {
  authSection: document.getElementById('authSection'),
  appSection: document.getElementById('appSection'),
  loginForm: document.getElementById('loginForm'),
  registerForm: document.getElementById('registerForm'),
  showLoginBtn: document.getElementById('showLoginBtn'),
  showRegisterBtn: document.getElementById('showRegisterBtn'),
  loginPage: document.getElementById('loginPage'),
  registerPage: document.getElementById('registerPage'),
  reloadBtn: document.getElementById('reloadBtn'),
  backToRestaurantsBtn: document.getElementById('backToRestaurantsBtn'),
  logoutBtn: document.getElementById('logoutBtn'),
  profileBtn: document.getElementById('profileBtn'),
  headerGuest: document.getElementById('headerGuest'),
  headerUser: document.getElementById('headerUser'),
  headerUserName: document.getElementById('headerUserName'),
  headerAddressBtn: document.getElementById('headerAddressBtn'),
  headerAddressText: document.getElementById('headerAddressText'),
  addressModal: document.getElementById('addressModal'),
  addressList: document.getElementById('addressList'),
  openAddAddressBtn: document.getElementById('openAddAddressBtn'),
  addressFormModal: document.getElementById('addressFormModal'),
  addressFormTitle: document.getElementById('addressFormTitle'),
  saveAddressBtn: document.getElementById('saveAddressBtn'),
  addressLabelInput: document.getElementById('addressLabelInput'),
  addressZipInput: document.getElementById('addressZipInput'),
  addressStreetInput: document.getElementById('addressStreetInput'),
  addressNumberInput: document.getElementById('addressNumberInput'),
  addressComplementInput: document.getElementById('addressComplementInput'),
  addressReferenceInput: document.getElementById('addressReferenceInput'),
  stateSelect: document.getElementById('stateSelect'),
  citySelect: document.getElementById('citySelect'),
  neighborhoodSelect: document.getElementById('neighborhoodSelect'),
  addressDefaultInput: document.getElementById('addressDefaultInput'),
  saveAddressBtn: document.getElementById('saveAddressBtn'),
  restaurantSections: document.getElementById('restaurantSections'),
  selectedRestaurantPage: document.getElementById('selectedRestaurantPage'),
  selectedRestaurantPanel: document.getElementById('selectedRestaurantPanel'),
  restaurantTitle: document.getElementById('restaurantTitle'),
  restaurantSubtitle: document.getElementById('restaurantSubtitle'),
  restaurantRatingBadge: document.getElementById('restaurantRatingBadge'),
  restaurantFeeMeta: document.getElementById('restaurantFeeMeta'),
  restaurantTimeMeta: document.getElementById('restaurantTimeMeta'),
  restaurantStatusMeta: document.getElementById('restaurantStatusMeta'),
  restaurantHoursMeta: document.getElementById('restaurantHoursMeta'),
  restaurantLogo: document.getElementById('restaurantLogo'),
  restaurantLogoFallback: document.getElementById('restaurantLogoFallback'),
  categoriesPanel: document.getElementById('categoriesPanel'),
  menuPanel: document.getElementById('menuPanel'),
  categoryTabs: document.getElementById('categoryTabs'),
  menuSections: document.getElementById('menuSections'),
  menuEmpty: document.getElementById('menuEmpty'),
  cartColumn: document.getElementById('cartColumn'),
  paymentMethodSelect: document.getElementById('paymentMethodSelect'),
  cashChangeWrap: document.getElementById('cashChangeWrap'),
  cashChangeInput: document.getElementById('cashChangeInput'),
  deliveryNameInput: document.getElementById('deliveryNameInput'),
  deliveryPhoneInput: document.getElementById('deliveryPhoneInput'),
  orderNotesInput: document.getElementById('orderNotesInput'),
  cartItems: document.getElementById('cartItems'),
  cartEmpty: document.getElementById('cartEmpty'),
  subtotalValue: document.getElementById('subtotalValue'),
  deliveryFeeValue: document.getElementById('deliveryFeeValue'),
  totalValue: document.getElementById('totalValue'),
  quoteBtn: document.getElementById('quoteBtn'),
  submitOrderBtn: document.getElementById('submitOrderBtn'),
  configModal: document.getElementById('configModal'),
  profileModal: document.getElementById('profileModal'),
  ordersBtn: document.getElementById('ordersBtn'),
  ordersModal: document.getElementById('ordersModal'),
  ordersList: document.getElementById('ordersList'),
  orderDetailsModal: document.getElementById('orderDetailsModal'),
  orderDetailsContent: document.getElementById('orderDetailsContent'),
  profileName: document.getElementById('profileName'),
  profilePhone: document.getElementById('profilePhone'),
  profileAddress: document.getElementById('profileAddress'),
  itemModal: document.getElementById('itemModal'),
  itemModalTitle: document.getElementById('itemModalTitle'),
  itemModalSubtitle: document.getElementById('itemModalSubtitle'),
  itemBasePrice: document.getElementById('itemBasePrice'),
  itemBadges: document.getElementById('itemBadges'),
  itemModalImage: document.getElementById('itemModalImage'),
  itemModalImageFallback: document.getElementById('itemModalImageFallback'),
  optionGroupsRoot: document.getElementById('optionGroupsRoot'),
  itemQuantityInput: document.getElementById('itemQuantityInput'),
  itemNotesInput: document.getElementById('itemNotesInput'),
  itemSummaryBase: document.getElementById('itemSummaryBase'),
  itemSummaryExtras: document.getElementById('itemSummaryExtras'),
  itemSummaryTotal: document.getElementById('itemSummaryTotal'),
  addToCartBtn: document.getElementById('addToCartBtn'),
  toastRoot: document.getElementById('toastRoot')
};

init();

function init() {
  bindEvents();
  updateHeader();
  setAuthMode('login');
  toggleCashChange();
  if (state.accessToken) {
    bootstrapAuthenticatedArea();
  } else {
    showAuthOnly();
  }
}

function bindEvents() {
  el.loginForm.addEventListener('submit', handleLogin);
  el.registerForm?.addEventListener('submit', handleRegister);
  el.showLoginBtn?.addEventListener('click', () => setAuthMode('login'));
  el.showRegisterBtn?.addEventListener('click', () => setAuthMode('register'));
  el.logoutBtn?.addEventListener('click', () => logout(true));
  el.profileBtn?.addEventListener('click', openProfileModal);
  el.ordersBtn?.addEventListener('click', openOrdersModal);
  el.ordersList?.addEventListener('click', handleOrdersListClick);
  el.headerAddressBtn?.addEventListener('click', openAddressModal);
  el.backToRestaurantsBtn?.addEventListener('click', () => openRestaurantListView(true));
  el.stateSelect?.addEventListener('change', handleStateChange);
  el.citySelect?.addEventListener('change', handleCityChange);
  el.saveAddressBtn?.addEventListener('click', saveAddress);
  el.openAddAddressBtn?.addEventListener('click', openAddressFormModal);
  el.reloadBtn.addEventListener('click', async () => {
    await loadRestaurantsByAddress();
    await loadSelectedRestaurantCatalog();
    showToast('Dados recarregados.', 'success');
  });
  el.categoryTabs.addEventListener('click', handleCategoryTabClick);
  el.menuSections.addEventListener('click', handleMenuClick);
  el.restaurantSections.addEventListener('click', handleRestaurantCardClick);
  el.addressList?.addEventListener('click', handleRestaurantCardClick);
  el.itemQuantityInput.addEventListener('input', updateCurrentItemSummary);
  el.itemNotesInput.addEventListener('input', updateCurrentItemSummary);
  el.optionGroupsRoot.addEventListener('change', updateCurrentItemSummary);
  el.addToCartBtn.addEventListener('click', addCurrentItemToCart);
  el.cartItems.addEventListener('click', handleCartActions);
  el.quoteBtn?.addEventListener('click', quoteOrder);
  el.submitOrderBtn.addEventListener('click', submitOrder);
  el.paymentMethodSelect.addEventListener('change', toggleCashChange);
  document.querySelectorAll('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', () => toggleModal(button.dataset.closeModal, false));
  });
  document.addEventListener('click', (event) => {
    const modal = event.target.closest('.modal');
    if (modal && event.target === modal) modal.classList.add('hidden');
  });
}

function setAuthMode(mode) {
  state.authMode = mode;
  el.showLoginBtn?.classList.toggle('active', mode === 'login');
  el.showRegisterBtn?.classList.toggle('active', mode === 'register');
  el.loginPage?.classList.toggle('hidden', mode !== 'login');
  el.registerPage?.classList.toggle('hidden', mode !== 'register');
}

function updateHeader() {
  const isLoggedIn = Boolean(state.accessToken && state.currentUser);
  el.headerGuest.classList.toggle('hidden', isLoggedIn);
  el.headerUser.classList.toggle('hidden', !isLoggedIn);
  el.headerUserName.textContent = isLoggedIn ? firstName(state.currentUser?.name) : '';
  updateHeaderAddress();
}

function updateHeaderAddress() {
  const address = state.addresses.find((item) => item.id === state.selectedAddressId);
  el.headerAddressText.textContent = address ? address.shortText : 'Escolha um endereço para ver os restaurantes.';
}

function openProfileModal() {
  const address = state.addresses.find((item) => item.id === state.selectedAddressId);
  el.profileName.textContent = state.currentUser?.name || '-';
  el.profilePhone.textContent = state.currentUser?.phone || '-';
  el.profileAddress.textContent = address?.labelText || 'Nenhum endereço selecionado';
  toggleModal('profileModal', true);
}


async function openOrdersModal() {
  if (!state.accessToken) return;
  el.ordersList.innerHTML = '<div class="empty">Carregando pedidos...</div>';
  toggleModal('ordersModal', true);
  const attempts = ['/orders/my', '/orders/user/me', '/orders/me'];
  let orders = null;
  let lastError = null;
  for (const path of attempts) {
    try {
      const result = await apiRequest(path, { auth: true, retryOn401: true });
      orders = unwrapCollection(result);
      break;
    } catch (error) {
      lastError = error;
    }
  }
  if (!orders) {
    el.ordersList.innerHTML = `<div class="empty">${escapeHtml(lastError?.message || 'Não foi possível carregar os pedidos.')}</div>`;
    return;
  }
  if (!orders.length) {
    state.orders = [];
    el.ordersList.innerHTML = '<div class="empty">Você ainda não tem pedidos.</div>';
    return;
  }
  state.orders = orders;
  el.ordersList.innerHTML = orders.map(renderOrderCard).join('');
}

function handleOrdersListClick(event) {
  const card = event.target.closest('.order-card');
  if (!card) return;
  const orderId = card.dataset.orderId;
  const order = state.orders.find((item) => String(item.id || item.orderId || item.uuid) === orderId);
  if (!order) return;
  openOrderDetails(order);
}

function renderOrderCard(order) {
  const items = unwrapCollection(order.items || order.orderItems || []);
  const preview = items.slice(0, 3).map((item) => item.menuItemName || item.name || item.menuItem?.name).filter(Boolean).join(', ');
  const total = Number(order.totalAmount || order.total || order.grandTotal || 0);
  const status = String(order.status || 'PENDENTE').replace(/_/g, ' ');
  const restaurant = order.restaurantName || order.restaurant?.name || 'Restaurante';
  const created = formatDateTime(order.createdAt || order.created_at || order.date);
  const orderId = String(order.id || order.orderId || order.uuid || '');
  return `
    <article class="order-card" data-order-id="${escapeHtml(orderId)}" role="button" tabindex="0">
      <div class="order-card-head">
        <strong>${escapeHtml(restaurant)}</strong>
        <span class="order-status-badge">${escapeHtml(status)}</span>
      </div>
      <div class="order-items-preview">${escapeHtml(preview || 'Itens do pedido')}</div>
      <div class="restaurant-inline-meta">${escapeHtml(created)} • ${escapeHtml(formatCurrency(total))}</div>
    </article>
  `;
}

function openOrderDetails(order) {
  const items = unwrapCollection(order.items || order.orderItems || []);
  const address = order.address || order.deliveryAddress || order.customerAddress || null;
  const payment = order.paymentMethod || order.payment || 'Não informado';
  const deliveryFee = Number(order.deliveryFee || order.fee || 0);
  const subtotal = Number(order.subtotal || order.subTotal || order.itemsTotal || 0);
  const total = Number(order.totalAmount || order.total || order.grandTotal || 0);
  const status = String(order.status || 'PENDENTE').replace(/_/g, ' ');
  const restaurant = order.restaurantName || order.restaurant?.name || 'Restaurante';
  const created = formatDateTime(order.createdAt || order.created_at || order.date);
  const addressText = [
    address?.street,
    address?.number,
    address?.neighborhood?.name || address?.neighborhoodName,
    address?.city?.name || address?.cityName,
    address?.state?.uf || address?.stateUf
  ].filter(Boolean).join(' • ');

  el.orderDetailsContent.innerHTML = `
    <div class="order-details-card">
      <div class="order-details-head">
        <div>
          <strong>${escapeHtml(restaurant)}</strong>
          <div class="restaurant-inline-meta">${escapeHtml(created)}</div>
        </div>
        <span class="order-status-badge">${escapeHtml(status)}</span>
      </div>
      <div class="order-details-grid">
        <div><span>Pagamento</span><strong>${escapeHtml(String(payment).replace(/_/g, ' '))}</strong></div>
        <div><span>Entrega</span><strong>${escapeHtml(formatCurrency(deliveryFee))}</strong></div>
        <div><span>Subtotal</span><strong>${escapeHtml(formatCurrency(subtotal))}</strong></div>
        <div><span>Total</span><strong>${escapeHtml(formatCurrency(total))}</strong></div>
      </div>
      <div class="order-details-block">
        <h4>Itens</h4>
        <div class="order-detail-items">${items.map(renderOrderDetailItem).join('') || '<div class="empty">Nenhum item encontrado.</div>'}</div>
      </div>
      <div class="order-details-block">
        <h4>Entrega</h4>
        <p>${escapeHtml(addressText || order.deliveryAddressText || 'Endereço não informado.')}</p>
      </div>
      ${order.notes || order.observations ? `<div class="order-details-block"><h4>Observações</h4><p>${escapeHtml(order.notes || order.observations)}</p></div>` : ''}
    </div>
  `;
  toggleModal('orderDetailsModal', true);
}

function renderOrderDetailItem(item) {
  const quantity = Number(item.quantity || item.qty || 1);
  const name = item.menuItemName || item.name || item.menuItem?.name || 'Item';
  const notes = item.notes || item.observations || '';
  const lineTotal = Number(item.totalPrice || item.total || item.lineTotal || 0);
  const choices = unwrapCollection(item.selectedChoices || item.choices || item.selections || []);
  const choicesText = choices.map((choice) => choice.choiceName || choice.name || choice.choice?.name).filter(Boolean).join(', ');
  return `
    <article class="order-detail-item">
      <div class="order-detail-item-head">
        <strong>${escapeHtml(`${quantity}x ${name}`)}</strong>
        <span>${escapeHtml(formatCurrency(lineTotal))}</span>
      </div>
      ${choicesText ? `<div class="order-items-preview">${escapeHtml(choicesText)}</div>` : ''}
      ${notes ? `<div class="order-items-preview">Obs.: ${escapeHtml(notes)}</div>` : ''}
    </article>
  `;
}

function formatDateTime(value) {
  if (!value) return 'Sem data';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('pt-BR');
}

function showAuthOnly() {
  el.authSection.classList.remove('hidden');
  el.appSection.classList.add('hidden');
}

async function bootstrapAuthenticatedArea() {
  try {
    await loadCurrentUser();
    await loadAddresses();
    await loadRestaurantsByAddress();
    openRestaurantListView();
    fillDeliveryFields();
    el.authSection.classList.add('hidden');
    el.appSection.classList.remove('hidden');
  } catch (error) {
    showToast(error.message || 'Erro ao carregar painel do usuário.', 'error');
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
    formEl.reset();
    await bootstrapAuthenticatedArea();
    showToast('Login realizado com sucesso.', 'success');
  } catch (error) {
    logout(false);
    showToast(error.message || 'Falha ao entrar.', 'error');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const formEl = event.currentTarget;
  const form = new FormData(formEl);
  try {
    await apiRequest('/auth/register', { method: 'POST', body: {
      name: String(form.get('name') || '').trim(),
      phone: String(form.get('phone') || '').trim() || undefined,
      email: String(form.get('email') || '').trim(),
      password: String(form.get('password') || '')
    } });
    formEl.reset();
    setAuthMode('login');
    el.loginForm?.querySelector('input[name="email"]')?.focus();
    showToast('Cadastro realizado com sucesso. Agora é só entrar.', 'success');
  } catch (error) {
    showToast(error.message || 'Não foi possível cadastrar.', 'error');
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
  state.addresses = [];
  state.selectedAddressId = '';
  state.selectedRestaurant = null;
  state.restaurants = [];
  state.restaurantBuckets = { available: [], closed: [], cityOnly: [] };
  state.catalog = null;
  state.categories = [];
  state.cart = [];
  state.deliveryFee = 0;
  state.currentQuote = null;
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.currentUser);
  renderRestaurantSections();
  renderCategories();
  renderMenu();
  renderCart();
  updateHeader();
  showAuthOnly();
  if (notify) showToast('Sessão encerrada.', 'info');
}

async function refreshSession() {
  const refreshed = await apiRequest('/auth/refresh', {
    method: 'POST', retryOn401: false, body: { refreshToken: state.refreshToken }
  });
  applyAuth(refreshed);
}

async function loadCurrentUser() {
  const me = await apiRequest('/auth/me', { auth: true, retryOn401: true });
  state.currentUser = normalizeUser(me);
  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(state.currentUser));
  updateHeader();
}

async function loadAddresses() {
  const addresses = unwrapCollection(await apiRequest('/addresses/my', { auth: true, retryOn401: true }));
  state.addresses = addresses.map(normalizeAddress);
  if (!state.addresses.length) throw new Error('Cadastre um endereço antes de fazer pedidos.');
  state.selectedAddressId = state.selectedAddressId && state.addresses.some((item) => item.id === state.selectedAddressId)
    ? state.selectedAddressId
    : (state.addresses.find((item) => item.isDefault)?.id || state.addresses[0].id);
  renderAddressList();
  updateHeaderAddress();
}

async function loadRestaurantsByAddress() {
  if (!state.selectedAddressId) return;
  const currentAddress = state.addresses.find((item) => item.id === state.selectedAddressId);
  if (!currentAddress) return;

  const [availableRaw, allRaw] = await Promise.all([
    apiRequest(`/restaurants/available/by-address/${state.selectedAddressId}`, { auth: true, retryOn401: true }).catch(() => []),
    apiRequest('/restaurants', { retryOn401: false }).catch(() => [])
  ]);

  const availableMap = new Map(unwrapCollection(availableRaw).map((item) => [item.id, item]));
  const sameCityRestaurants = unwrapCollection(allRaw)
    .filter((item) => (item.cityId || item.city?.id || '') === currentAddress.cityId)
    .map(normalizeRestaurant);

  const zoneEntries = await Promise.all(sameCityRestaurants
    .filter((item) => item.isActive)
    .map(async (restaurant) => {
      const zones = unwrapCollection(await apiRequest(`/restaurant-delivery-zones/public/restaurant/${restaurant.id}`, { retryOn401: false }).catch(() => []));
      return [restaurant.id, zones];
    }));
  const zonesByRestaurant = new Map(zoneEntries);

  const hourEntries = await Promise.all(sameCityRestaurants.map(async (restaurant) => {
    const hours = await fetchRestaurantHours(restaurant.id);
    return [restaurant.id, hours];
  }));
  state.restaurantHoursById = Object.fromEntries(hourEntries);

  state.restaurants = sameCityRestaurants.map((restaurant) => {
    const matchingAvailable = availableMap.get(restaurant.id);
    const zones = zonesByRestaurant.get(restaurant.id) || [];
    const hours = state.restaurantHoursById[restaurant.id] || [];
    const neighborhoodZone = zones.find((zone) => (zone.neighborhoodId || zone.neighborhood?.id) === currentAddress.neighborhoodId && zone.isActive !== false);
    const previewZone = neighborhoodZone || zones.find((zone) => zone.isActive !== false) || null;
    const deliveryFee = Number(neighborhoodZone?.deliveryFee ?? previewZone?.deliveryFee ?? 0);
    const minTime = Number(neighborhoodZone?.minTime ?? previewZone?.minTime ?? 0);
    const maxTime = Number(neighborhoodZone?.maxTime ?? previewZone?.maxTime ?? 0);
    const categoryNames = unwrapCollection(restaurant.menuCategories || matchingAvailable?.menuCategories || []).map((item) => item.name).filter(Boolean);
    const isAvailableForAddress = Boolean(matchingAvailable || neighborhoodZone);
    const openInfo = getRestaurantOpenInfo(hours);
    const isCurrentlyOpen = restaurant.isActive && openInfo.isOpen;
    return {
      ...restaurant,
      hours,
      categoryNames,
      deliveryFee,
      minTime,
      maxTime,
      rating: Number(restaurant.rating || 5),
      isAvailableForAddress,
      isClosed: !isCurrentlyOpen,
      isCurrentlyOpen,
      openLabel: openInfo.label,
      hoursTodayLabel: openInfo.todayLabel,
      zoneCount: zones.length
    };
  });

  state.restaurantBuckets = {
    available: state.restaurants.filter((item) => item.isCurrentlyOpen && item.isAvailableForAddress),
    closed: state.restaurants.filter((item) => !item.isCurrentlyOpen),
    cityOnly: state.restaurants.filter((item) => item.isCurrentlyOpen && !item.isAvailableForAddress)
  };

  const currentSelectedId = state.selectedRestaurant?.id;
  state.selectedRestaurant = currentSelectedId
    ? state.restaurants.find((item) => item.id === currentSelectedId) || null
    : null;

  renderRestaurantSections();
  renderSelectedRestaurant();
}

async function loadSelectedRestaurantCatalog() {
  if (!state.selectedRestaurant?.id) {
    state.catalog = null;
    state.categories = [];
    state.deliveryFee = 0;
    renderSelectedRestaurant();
    renderCategories();
    renderMenu();
    renderCart();
    return;
  }

  const catalog = await apiRequest(`/menu/restaurant/${state.selectedRestaurant.id}/catalog?onlyAvailable=true`, { retryOn401: false });
  state.catalog = catalog;
  state.categories = normalizeCatalogCategories(catalog);
  state.deliveryFee = Number(state.selectedRestaurant.deliveryFee || 0);
  renderSelectedRestaurant();
  renderCategories();
  renderMenu();
  renderCart();
}

function renderAddressList() {
  if (!el.addressList) return;
  el.addressList.innerHTML = state.addresses.map((address) => `
    <div class="address-list-row">
      <button class="address-list-item ${address.id === state.selectedAddressId ? 'active' : ''}" type="button" data-address-id="${escapeAttribute(address.id)}">
        <strong>${escapeHtml(address.label || 'Endereço')}</strong>
        <span>${escapeHtml(address.labelText)}</span>
        ${address.isDefault ? '<em>Principal</em>' : ''}
      </button>
      <button class="ghost-btn small address-edit-btn" type="button" data-edit-address-id="${escapeAttribute(address.id)}">Editar</button>
    </div>
  `).join('');
}

function renderRestaurantSections() {
  const address = state.addresses.find((item) => item.id === state.selectedAddressId);
  const cityName = address?.city?.name || address?.cityName || 'sua cidade';
  const neighborhoodName = address?.neighborhood?.name || address?.neighborhoodName || 'seu bairro';
  const blocks = [
    {
      key: 'available',
      title: 'Restaurantes disponíveis',
      items: state.restaurantBuckets.available,
      empty: 'Nenhum restaurante aberto entrega neste endereço agora.'
    },
    {
      key: 'closed',
      title: 'Estabelecimentos fechados',
      items: state.restaurantBuckets.closed,
      empty: ''
    },
    {
      key: 'cityOnly',
      title: `Estabelecimentos de ${cityName} que não entregam no bairro ${neighborhoodName}`,
      items: state.restaurantBuckets.cityOnly,
      empty: ''
    }
  ].filter((block) => block.items.length || block.empty);

  el.restaurantSections.innerHTML = blocks.map((block) => `
    <section class="section-block">
      <h3 class="section-title">${escapeHtml(block.title)}</h3>
      ${block.items.length ? `
        <div class="restaurant-grid">
          ${block.items.map((item) => renderRestaurantCard(item, block.key)).join('')}
        </div>
      ` : `<div class="empty">${escapeHtml(block.empty)}</div>`}
    </section>
  `).join('');
}

function renderRestaurantCard(restaurant, bucketKey) {
  const logo = restaurant.logoUrl
    ? `<img class="restaurant-card-logo" src="${escapeAttribute(restaurant.logoUrl)}" alt="${escapeAttribute(restaurant.name)}">`
    : `<div class="restaurant-logo-fallback">${escapeHtml(initials(restaurant.name))}</div>`;
  const deliveryText = restaurant.isAvailableForAddress
    ? (restaurant.deliveryFee > 0 ? formatCurrency(restaurant.deliveryFee) : '<span class="delivery-free">GRÁTIS</span>')
    : 'Não entrega nesse bairro';
  const timeText = restaurant.minTime && restaurant.maxTime ? `${restaurant.minTime}-${restaurant.maxTime}min` : '60-90min';
  const categories = restaurant.categoryNames?.length ? restaurant.categoryNames.slice(0, 3).join(', ') : (restaurant.description || 'Restaurante');
  const promo = bucketKey === 'cityOnly'
    ? '<div class="muted-red">Disponível na sua cidade, mas fora da zona deste bairro.</div>'
    : bucketKey === 'closed'
      ? `<div class="muted-red">${escapeHtml(restaurant.openLabel || 'No momento este estabelecimento está fechado.')}</div>`
      : (restaurant.hoursTodayLabel ? `<div class="muted-line">${escapeHtml(restaurant.hoursTodayLabel)}</div>` : '');

  return `
    <article class="restaurant-card ${state.selectedRestaurant?.id === restaurant.id ? 'selected' : ''} ${bucketKey !== 'available' ? 'is-muted' : ''}" data-restaurant-id="${escapeAttribute(restaurant.id)}">
      ${logo}
      <div class="restaurant-card-body">
        <div class="restaurant-card-head">
          <h4>${escapeHtml(restaurant.name)}</h4>
          <span class="rating-mini">${escapeHtml(String(restaurant.rating || 5))} ★</span>
        </div>
        <div class="restaurant-card-sub">${escapeHtml(categories)} • $</div>
        <div class="restaurant-inline-meta">${deliveryText} • ${escapeHtml(timeText)} • ${escapeHtml(restaurant.isCurrentlyOpen ? 'Aberto' : 'Fechado')}</div>
        ${promo}
      </div>
    </article>
  `;
}

function renderSelectedRestaurant() {
  const restaurant = state.selectedRestaurant;
  const hasRestaurant = Boolean(restaurant) && state.currentView === 'detail';
  el.selectedRestaurantPage.classList.toggle('hidden', !hasRestaurant);
  el.selectedRestaurantPanel.classList.toggle('hidden', !hasRestaurant);
  el.categoriesPanel.classList.toggle('hidden', !hasRestaurant);
  el.menuPanel.classList.toggle('hidden', !hasRestaurant);
  el.restaurantSections.classList.toggle('hidden', hasRestaurant);
  if (!restaurant || state.currentView !== 'detail') return;

  el.restaurantTitle.textContent = restaurant.name || 'Restaurante';
  el.restaurantSubtitle.textContent = restaurant.categoryNames?.length
    ? `${restaurant.categoryNames.join(', ')} • $`
    : (restaurant.description || 'Cardápio do restaurante');
  el.restaurantRatingBadge.textContent = `${restaurant.rating || 5} ★`;
  el.restaurantFeeMeta.innerHTML = restaurant.isAvailableForAddress
    ? (restaurant.deliveryFee > 0 ? formatCurrency(restaurant.deliveryFee) : '<span class="delivery-free">GRÁTIS</span>')
    : 'Não entrega no seu bairro';
  el.restaurantTimeMeta.textContent = restaurant.minTime && restaurant.maxTime ? `${restaurant.minTime}-${restaurant.maxTime}min` : '60-90min';
  el.restaurantStatusMeta.textContent = restaurant.isCurrentlyOpen ? 'Aberto' : 'Fechado';
  if (el.restaurantHoursMeta) el.restaurantHoursMeta.textContent = restaurant.hoursTodayLabel || 'Horário não informado';

  if (restaurant.logoUrl) {
    el.restaurantLogo.src = restaurant.logoUrl;
    el.restaurantLogo.classList.remove('hidden');
    el.restaurantLogoFallback.classList.add('hidden');
  } else {
    el.restaurantLogo.classList.add('hidden');
    el.restaurantLogoFallback.classList.remove('hidden');
    el.restaurantLogoFallback.textContent = initials(restaurant.name || 'MD');
  }
}

function renderCategories() {
  if (!state.categories.length) {
    el.categoryTabs.innerHTML = '<div class="empty">Nenhuma categoria disponível.</div>';
    return;
  }
  el.categoryTabs.innerHTML = state.categories.map((category, index) => `
    <button class="category-tab ${index === 0 ? 'active' : ''}" type="button" data-category-tab="${escapeAttribute(category.id)}">
      ${escapeHtml(category.name)}
    </button>
  `).join('');
}

function renderMenu() {
  if (!state.categories.length) {
    el.menuSections.innerHTML = '';
    el.menuEmpty.classList.remove('hidden');
    return;
  }
  el.menuEmpty.classList.add('hidden');
  el.menuSections.innerHTML = state.categories.map((category) => `
    <section class="menu-section" id="category-${escapeAttribute(category.id)}" data-category-section="${escapeAttribute(category.id)}">
      <div class="menu-section-head">
        <div>
          <h3>${escapeHtml(category.name)}</h3>
          ${category.description ? `<p>${escapeHtml(category.description)}</p>` : ''}
        </div>
      </div>
      <div class="menu-grid">
        ${category.menuItems.length ? category.menuItems.map(renderItemCard).join('') : '<div class="empty">Nenhum item nesta categoria.</div>'}
      </div>
    </section>
  `).join('');
}

function renderItemCard(item) {
  const image = item.imageUrl
    ? `<div class="item-card-cover"><img src="${escapeAttribute(item.imageUrl)}" alt="${escapeAttribute(item.name)}"></div>`
    : `<div class="item-card-cover"><div class="item-cover-fallback">${escapeHtml(initials(item.name))}</div></div>`;
  return `
    <article class="item-card">
      ${image}
      <div class="item-card-body">
        <h4>${escapeHtml(item.name)}</h4>
        <p class="muted">${escapeHtml(item.description || '')}</p>
        <div class="tag-row">
          ${item.options.length ? `<span class="meta-pill">${item.options.length} grupo(s)</span>` : ''}
          ${item.isFeatured ? '<span class="tag">Destaque</span>' : ''}
        </div>
      </div>
      <div class="item-card-actions">
        <div class="item-price">${formatCurrency(item.price)}</div>
        <button class="primary-btn" type="button" data-add-item="${escapeAttribute(item.id)}">Escolher</button>
      </div>
    </article>
  `;
}

function handleRestaurantCardClick(event) {
  const editAddressButton = event.target.closest('[data-edit-address-id]');
  if (editAddressButton) {
    openEditAddressModal(editAddressButton.dataset.editAddressId).catch((error) => showToast(error.message || 'Não foi possível abrir o endereço.', 'error'));
    return;
  }
  const addressButton = event.target.closest('[data-address-id]');
  if (addressButton) {
    handleAddressChange(addressButton.dataset.addressId).catch((error) => showToast(error.message || 'Não foi possível trocar o endereço.', 'error'));
    return;
  }
  const card = event.target.closest('[data-restaurant-id]');
  if (!card) return;
  const restaurant = state.restaurants.find((item) => item.id === card.dataset.restaurantId);
  if (!restaurant) return;
  if (state.selectedRestaurant?.id && state.selectedRestaurant.id !== restaurant.id) {
    state.cart = [];
    state.currentQuote = null;
  }
  state.selectedRestaurant = restaurant;
  openRestaurantDetailView();
  loadSelectedRestaurantCatalog().catch((error) => {
    showToast(error.message || 'Não foi possível abrir o restaurante.', 'error');
  });
  renderRestaurantSections();
}

function handleCategoryTabClick(event) {
  const button = event.target.closest('[data-category-tab]');
  if (!button) return;
  [...el.categoryTabs.querySelectorAll('.category-tab')].forEach((tab) => tab.classList.remove('active'));
  button.classList.add('active');
  document.getElementById(`category-${button.dataset.categoryTab}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleMenuClick(event) {
  const button = event.target.closest('[data-add-item]');
  if (!button) return;
  const item = findMenuItemById(button.dataset.addItem);
  if (!item) return;
  if (!state.selectedRestaurant?.isCurrentlyOpen) {
    showToast(state.selectedRestaurant?.openLabel || 'Este restaurante está fechado no momento.', 'info');
    return;
  }
  if (!state.selectedRestaurant?.isAvailableForAddress) {
    showToast('Este restaurante não entrega no endereço selecionado.', 'info');
    return;
  }
  openItemModal(item);
}

function openItemModal(item) {
  state.currentItem = structuredClone(item);
  el.itemModalTitle.textContent = item.name;
  el.itemModalSubtitle.textContent = item.description || 'Escolha os adicionais e a quantidade.';
  el.itemBasePrice.textContent = formatCurrency(item.price);
  el.itemSummaryBase.textContent = formatCurrency(item.price);
  el.itemQuantityInput.value = '1';
  el.itemNotesInput.value = '';
  el.itemNotesInput.disabled = !item.allowsItemNotes;
  el.itemNotesInput.placeholder = item.allowsItemNotes ? '' : 'Este item não aceita observações';
  el.itemBadges.innerHTML = `${item.isFeatured ? '<span class="tag">Destaque</span>' : ''}${item.maxPerOrder ? `<span class="meta-pill">Máx. ${item.maxPerOrder}</span>` : ''}`;

  if (item.imageUrl) {
    el.itemModalImage.src = item.imageUrl;
    el.itemModalImage.classList.remove('hidden');
    el.itemModalImageFallback.classList.add('hidden');
  } else {
    el.itemModalImage.classList.add('hidden');
    el.itemModalImageFallback.classList.remove('hidden');
    el.itemModalImageFallback.textContent = initials(item.name);
  }

  el.optionGroupsRoot.innerHTML = item.options.map(renderOptionGroup).join('');
  updateCurrentItemSummary();
  toggleModal('itemModal', true);
}

function renderOptionGroup(option) {
  const min = option.minSelect ?? (option.required ? 1 : 0);
  const max = option.maxSelect;
  const multiple = (max ?? 2) > 1;
  return `
    <section class="option-group" data-option-id="${escapeAttribute(option.id)}" data-min="${min}" data-max="${max ?? ''}">
      <div class="option-group-head">
        <div>
          <strong>${escapeHtml(option.name)}</strong>
          <div class="muted">${escapeHtml(buildOptionHint(option))}</div>
        </div>
      </div>
      <div class="option-choices">
        ${option.choices.map((choice) => `
          <label class="choice-row">
            <div class="choice-main">
              <input
                type="${multiple ? 'checkbox' : 'radio'}"
                name="option-${escapeAttribute(option.id)}"
                value="${escapeAttribute(choice.id)}"
                data-option-id="${escapeAttribute(option.id)}"
                data-choice-id="${escapeAttribute(choice.id)}"
                data-choice-price="${Number(choice.price || 0)}"
              />
              <div>
                <div><strong>${escapeHtml(choice.name)}</strong></div>
                <div class="muted">${escapeHtml(choice.description || '')}</div>
              </div>
            </div>
            <div class="choice-price">${Number(choice.price || 0) > 0 ? `+ ${formatCurrency(choice.price)}` : 'Grátis'}</div>
          </label>
        `).join('')}
      </div>
    </section>
  `;
}

function updateCurrentItemSummary() {
  if (!state.currentItem) return;
  enforceOptionLimits();
  const selectedChoices = collectCurrentSelections();
  const extras = selectedChoices.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const quantity = Math.max(1, Number(el.itemQuantityInput.value || 1));
  const total = (Number(state.currentItem.price || 0) + extras) * quantity;
  el.itemSummaryExtras.textContent = formatCurrency(extras);
  el.itemSummaryTotal.textContent = formatCurrency(total);
}

function enforceOptionLimits() {
  el.optionGroupsRoot.querySelectorAll('[data-option-id][data-max]').forEach((group) => {
    const max = Number(group.dataset.max || 0);
    if (!max) return;
    const checked = [...group.querySelectorAll('input:checked')];
    if (checked.length <= max) return;
    const lastChecked = checked[checked.length - 1];
    lastChecked.checked = false;
    showToast(`Este grupo permite no máximo ${max} seleção(ões).`, 'info');
  });
}

function collectCurrentSelections() {
  return [...el.optionGroupsRoot.querySelectorAll('input:checked')].map((input) => ({
    optionId: input.dataset.optionId,
    choiceId: input.dataset.choiceId,
    price: Number(input.dataset.choicePrice || 0)
  }));
}

function validateCurrentItemSelections() {
  const groups = [...el.optionGroupsRoot.querySelectorAll('[data-option-id]')];
  for (const group of groups) {
    const min = Number(group.dataset.min || 0);
    const max = group.dataset.max ? Number(group.dataset.max) : null;
    const checked = group.querySelectorAll('input:checked').length;
    const name = group.querySelector('.option-group-head strong')?.textContent || 'Grupo';
    if (checked < min) {
      showToast(`O grupo "${name}" exige no mínimo ${min} seleção(ões).`, 'error');
      return false;
    }
    if (max !== null && checked > max) {
      showToast(`O grupo "${name}" permite no máximo ${max} seleção(ões).`, 'error');
      return false;
    }
  }
  if (state.currentItem.maxPerOrder && Number(el.itemQuantityInput.value || 1) > state.currentItem.maxPerOrder) {
    showToast(`Este item aceita no máximo ${state.currentItem.maxPerOrder} unidade(s) por pedido.`, 'error');
    return false;
  }
  return true;
}

function addCurrentItemToCart() {
  if (!state.currentItem) return;
  if (!state.selectedRestaurant?.isCurrentlyOpen) {
    showToast(state.selectedRestaurant?.openLabel || 'Este restaurante está fechado.', 'error');
    return;
  }
  if (!state.selectedRestaurant?.isAvailableForAddress) {
    showToast('Este restaurante não entrega no endereço selecionado.', 'error');
    return;
  }
  if (!validateCurrentItemSelections()) return;

  const quantity = Math.max(1, Number(el.itemQuantityInput.value || 1));
  const selectedChoices = collectCurrentSelections().map((selection) => {
    const option = state.currentItem.options.find((item) => item.id === selection.optionId);
    const choice = option?.choices.find((item) => item.id === selection.choiceId);
    return {
      optionId: selection.optionId,
      optionName: option?.name || '',
      choiceId: selection.choiceId,
      choiceName: choice?.name || '',
      price: Number(choice?.price || 0)
    };
  });
  const extras = selectedChoices.reduce((sum, item) => sum + Number(item.price || 0), 0);
  state.cart.push({
    uid: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    menuItemId: state.currentItem.id,
    name: state.currentItem.name,
    basePrice: Number(state.currentItem.price || 0),
    quantity,
    notes: state.currentItem.allowsItemNotes ? el.itemNotesInput.value.trim() : '',
    selectedChoices,
    totalUnitPrice: Number(state.currentItem.price || 0) + extras
  });
  renderCart();
  toggleModal('itemModal', false);
  showToast('Item adicionado ao carrinho.', 'success');
}

function renderCart() {
  el.cartColumn.classList.toggle('hidden', !state.cart.length || state.currentView !== 'detail');
  if (!state.cart.length) {
    el.cartItems.innerHTML = '';
    el.cartEmpty.classList.remove('hidden');
  } else {
    el.cartEmpty.classList.add('hidden');
    el.cartItems.innerHTML = state.cart.map((item) => `
      <article class="cart-item">
        <div class="cart-item-head">
          <strong>${escapeHtml(item.quantity)}x ${escapeHtml(item.name)}</strong>
          <strong>${formatCurrency(item.totalUnitPrice * item.quantity)}</strong>
        </div>
        <div class="muted">Base ${formatCurrency(item.basePrice)}${item.notes ? ` • Obs.: ${escapeHtml(item.notes)}` : ''}</div>
        ${item.selectedChoices.length ? `
          <div class="cart-item-choices">
            ${item.selectedChoices.map((choice) => `<span>${escapeHtml(choice.optionName)}: ${escapeHtml(choice.choiceName)}${Number(choice.price || 0) ? ` (+ ${formatCurrency(choice.price)})` : ''}</span>`).join('')}
          </div>
        ` : ''}
        <div class="cart-actions">
          <button class="text-btn" type="button" data-remove-cart-item="${escapeAttribute(item.uid)}">Remover</button>
        </div>
      </article>
    `).join('');
  }

  const subtotal = state.cart.reduce((sum, item) => sum + (item.totalUnitPrice * item.quantity), 0);
  const total = subtotal + Number(state.deliveryFee || 0);
  el.subtotalValue.textContent = formatCurrency(subtotal);
  el.deliveryFeeValue.textContent = formatCurrency(state.deliveryFee || 0);
  el.totalValue.textContent = formatCurrency(total);
}

function handleCartActions(event) {
  const button = event.target.closest('[data-remove-cart-item]');
  if (!button) return;
  state.cart = state.cart.filter((item) => item.uid !== button.dataset.removeCartItem);
  renderCart();
}

async function quoteOrder() {
  try {
    const payload = buildOrderPayload();
    const quote = await apiRequest('/orders/quote', { method: 'POST', auth: true, retryOn401: true, body: payload });
    state.currentQuote = quote;
    const total = Number(quote.total ?? quote.summary?.total ?? 0);
    const deliveryFee = Number((quote.deliveryFee ?? quote.summary?.deliveryFee ?? state.deliveryFee) || 0);
    state.deliveryFee = deliveryFee;
    renderCart();
    if (total) el.totalValue.textContent = formatCurrency(total);
    showToast('Pedido calculado com sucesso.', 'success');
  } catch (error) {
    showToast(error.message || 'Não foi possível calcular o pedido.', 'error');
  }
}

async function submitOrder() {
  try {
    const payload = buildOrderPayload();
    const result = await apiRequest('/orders', { method: 'POST', auth: true, retryOn401: true, body: payload });
    state.cart = [];
    state.currentQuote = result;
    renderCart();
    showToast('Pedido enviado com sucesso.', 'success');
  } catch (error) {
    showToast(error.message || 'Não foi possível finalizar o pedido.', 'error');
  }
}

function buildOrderPayload() {
  if (!state.selectedRestaurant?.id) throw new Error('Selecione um restaurante.');
  if (!state.selectedRestaurant?.isCurrentlyOpen) throw new Error(state.selectedRestaurant?.openLabel || 'O restaurante selecionado está fechado.');
  if (!state.selectedRestaurant?.isAvailableForAddress) throw new Error('O restaurante selecionado não entrega no seu bairro.');
  if (!state.selectedAddressId) throw new Error('Selecione um endereço.');
  if (!state.cart.length) throw new Error('Adicione pelo menos um item ao carrinho.');

  const paymentMethod = el.paymentMethodSelect.value;
  const subtotal = state.cart.reduce((sum, item) => sum + (item.totalUnitPrice * item.quantity), 0);
  const orderTotal = subtotal + Number(state.deliveryFee || 0);
  const cashChangeFor = paymentMethod === 'CASH' && el.cashChangeInput.value ? Number(el.cashChangeInput.value) : undefined;
  if (paymentMethod === 'CASH' && cashChangeFor !== undefined && cashChangeFor < orderTotal) {
    throw new Error('O valor para troco precisa ser maior ou igual ao total do pedido.');
  }

  const payload = {
    restaurantId: state.selectedRestaurant.id,
    userAddressId: state.selectedAddressId,
    paymentMethod,
    notes: el.orderNotesInput.value.trim() || undefined,
    cashChangeFor,
    deliveryName: el.deliveryNameInput.value.trim() || state.currentUser?.name || '',
    deliveryPhone: el.deliveryPhoneInput.value.trim() || state.currentUser?.phone || '',
    items: state.cart.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      notes: item.notes || undefined,
      selectedChoices: item.selectedChoices.map((choice) => ({ optionId: choice.optionId, choiceId: choice.choiceId }))
    }))
  };

  if (!payload.deliveryName) throw new Error('Informe o nome para entrega.');
  if (!payload.deliveryPhone) throw new Error('Informe o telefone para entrega.');

  return payload;
}

function fillDeliveryFields() {
  if (!el.deliveryNameInput.value) el.deliveryNameInput.value = state.currentUser?.name || '';
  if (!el.deliveryPhoneInput.value) el.deliveryPhoneInput.value = state.currentUser?.phone || '';
}

function toggleCashChange() {
  const isCash = el.paymentMethodSelect.value === 'CASH';
  el.cashChangeWrap.classList.toggle('hidden', !isCash);
  if (!isCash) el.cashChangeInput.value = '';
}

async function handleAddressChange(addressId) {
  state.selectedAddressId = addressId;
  state.cart = [];
  state.selectedRestaurant = null;
  renderCart();
  updateHeaderAddress();
  toggleModal('addressModal', false);
  await loadRestaurantsByAddress();
  openRestaurantListView();
}

function openRestaurantListView(clearCart=false) {
  state.currentView = 'list';
  if (clearCart) {
    state.cart = [];
    state.currentQuote = null;
  }
  renderSelectedRestaurant();
  renderCart();
}

function openRestaurantDetailView() {
  state.currentView = 'detail';
  renderSelectedRestaurant();
  renderCart();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


function resetAddressForm() {
  state.editingAddressId = null;
  if (el.addressFormTitle) el.addressFormTitle.textContent = 'Novo endereço';
  if (el.saveAddressBtn) el.saveAddressBtn.textContent = 'Salvar endereço';
  [el.addressLabelInput, el.addressZipInput, el.addressStreetInput, el.addressNumberInput, el.addressComplementInput, el.addressReferenceInput].forEach((input) => input.value = '');
  el.addressDefaultInput.checked = true;
  [el.stateSelect, el.citySelect, el.neighborhoodSelect].forEach((input) => input.value = '');
}

async function openEditAddressModal(addressId) {
  const address = state.addresses.find((item) => item.id === addressId);
  if (!address) throw new Error('Endereço não encontrado.');
  state.editingAddressId = address.id;
  if (el.addressFormTitle) el.addressFormTitle.textContent = 'Editar endereço';
  if (el.saveAddressBtn) el.saveAddressBtn.textContent = 'Salvar alterações';
  toggleModal('addressFormModal', true);
  if (!state.states.length) {
    await loadStates().catch(() => {});
  }
  el.addressLabelInput.value = address.label || '';
  el.addressZipInput.value = address.zipCode || '';
  el.addressStreetInput.value = address.street || '';
  el.addressNumberInput.value = address.number || '';
  el.addressComplementInput.value = address.complement || '';
  el.addressReferenceInput.value = address.reference || '';
  el.addressDefaultInput.checked = !!address.isDefault;
  const stateId = address.city?.state?.id || address.stateId || '';
  if (stateId) {
    el.stateSelect.value = stateId;
    await handleStateChange(false);
  }
  if (address.cityId) {
    el.citySelect.value = address.cityId;
    await handleCityChange(false);
  }
  if (address.neighborhoodId) el.neighborhoodSelect.value = address.neighborhoodId;
}

async function openAddressModal() {
  toggleModal('addressModal', true);
  renderAddressList();
}

async function openAddressFormModal() {
  resetAddressForm();
  toggleModal('addressFormModal', true);
  if (!state.states.length) {
    await loadStates().catch(() => {});
  }
}

async function loadStates() {
  state.states = unwrapCollection(await apiRequest('/locations/states', { retryOn401: false }));
  el.stateSelect.innerHTML = '<option value="">Selecione</option>' + state.states.map((item) => `<option value="${escapeAttribute(item.id)}">${escapeHtml(item.name)}${item.code ? ` - ${escapeHtml(item.code)}` : ''}</option>`).join('');
  const current = state.addresses.find((item) => item.id === state.selectedAddressId);
  if (current?.city?.state?.id) {
    el.stateSelect.value = current.city.state.id;
    await handleStateChange(false);
    if (current.cityId) {
      el.citySelect.value = current.cityId;
      await handleCityChange(false);
      if (current.neighborhoodId) el.neighborhoodSelect.value = current.neighborhoodId;
    }
  }
}

async function handleStateChange(clear=true) {
  const stateId = el.stateSelect.value;
  state.cities = stateId ? unwrapCollection(await apiRequest(`/locations/states/${stateId}/cities`, { retryOn401: false })) : [];
  el.citySelect.innerHTML = '<option value="">Selecione</option>' + state.cities.map((item) => `<option value="${escapeAttribute(item.id)}">${escapeHtml(item.name)}</option>`).join('');
  el.neighborhoodSelect.innerHTML = '<option value="">Selecione</option>';
  if (clear) el.citySelect.value = '';
}

async function handleCityChange(clear=true) {
  const cityId = el.citySelect.value;
  state.neighborhoods = cityId ? unwrapCollection(await apiRequest(`/locations/cities/${cityId}/neighborhoods`, { retryOn401: false })) : [];
  el.neighborhoodSelect.innerHTML = '<option value="">Selecione</option>' + state.neighborhoods.map((item) => `<option value="${escapeAttribute(item.id)}">${escapeHtml(item.name)}</option>`).join('');
  if (clear) el.neighborhoodSelect.value = '';
}

async function saveAddress() {
  try {
    const payload = {
      label: el.addressLabelInput.value.trim() || undefined,
      street: el.addressStreetInput.value.trim(),
      number: el.addressNumberInput.value.trim(),
      complement: el.addressComplementInput.value.trim() || undefined,
      reference: el.addressReferenceInput.value.trim() || undefined,
      zipCode: el.addressZipInput.value.trim(),
      cityId: el.citySelect.value,
      neighborhoodId: el.neighborhoodSelect.value,
      isDefault: el.addressDefaultInput.checked
    };
    if (!payload.street || !payload.number || !payload.zipCode || !payload.cityId || !payload.neighborhoodId) {
      throw new Error(state.editingAddressId ? 'Preencha os campos do endereço.' : 'Preencha os campos do novo endereço.');
    }
    const path = state.editingAddressId ? `/addresses/${state.editingAddressId}` : '/addresses';
    const method = state.editingAddressId ? 'PATCH' : 'POST';
    const isEditing = !!state.editingAddressId;
    await apiRequest(path, { method, auth: true, retryOn401: true, body: payload });
    await loadAddresses();
    await loadRestaurantsByAddress();
    toggleModal('addressFormModal', false);
    toggleModal('addressModal', false);
    resetAddressForm();
    showToast(isEditing ? 'Endereço alterado com sucesso.' : 'Endereço salvo com sucesso.', 'success');
  } catch (error) {
    showToast(error.message || 'Não foi possível salvar o endereço.', 'error');
  }
}

function normalizeCatalogCategories(payload) {
  const source = unwrapData(payload) || payload || {};
  const categories = Array.isArray(source.categories) ? source.categories : [];
  return categories.map((category) => ({
    id: category.id,
    name: category.name || 'Categoria',
    description: category.description || '',
    sortOrder: Number(category.sortOrder ?? 0),
    menuItems: unwrapCollection(category.menuItems).map(normalizeMenuItem)
  })).sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

function normalizeMenuItem(item) {
  return {
    id: item.id,
    name: item.name || 'Item',
    description: item.description || '',
    imageUrl: item.imageUrl || '',
    price: Number(item.price || 0),
    isFeatured: Boolean(item.isFeatured),
    allowsItemNotes: item.allowsItemNotes !== false,
    maxPerOrder: item.maxPerOrder ?? null,
    options: unwrapCollection(item.options).map((option) => ({
      id: option.id,
      name: option.name || 'Opção',
      required: Boolean(option.required),
      minSelect: option.minSelect ?? null,
      maxSelect: option.maxSelect ?? null,
      choices: unwrapCollection(option.choices).map((choice) => ({
        id: choice.id,
        name: choice.name || 'Escolha',
        description: choice.description || '',
        price: Number(choice.price || 0)
      }))
    }))
  };
}

function normalizeRestaurant(item) {
  return {
    ...item,
    id: item.id,
    name: item.name || 'Restaurante',
    description: item.description || '',
    logoUrl: item.logoUrl || '',
    address: item.address || '',
    isActive: item.isActive !== false,
    cityId: item.cityId || item.city?.id || '',
    cityLabel: [item.city?.name, item.city?.state?.code].filter(Boolean).join(' - '),
    hours: normalizeOpeningHours(item.hours || item.openingHours || []),
    menuCategories: unwrapCollection(item.menuCategories || item.categories || [])
  };
}


function normalizeOpeningHours(items) {
  return unwrapCollection(items)
    .map((item) => ({
      id: item.id || '',
      dayOfWeek: Number(item.dayOfWeek),
      openTime: normalizeTime(item.openTime),
      closeTime: normalizeTime(item.closeTime)
    }))
    .filter((item) => Number.isInteger(item.dayOfWeek) && item.dayOfWeek >= 0 && item.dayOfWeek <= 6 && item.openTime && item.closeTime)
    .sort((a, b) => (a.dayOfWeek - b.dayOfWeek) || a.openTime.localeCompare(b.openTime));
}

async function fetchRestaurantHours(restaurantId) {
  if (!restaurantId) return [];
  const cached = state.restaurantHoursById?.[restaurantId];
  if (Array.isArray(cached) && cached.length) return cached;
  const candidates = [
    `/restaurants/${restaurantId}/opening-hours`,
    `/restaurants/${restaurantId}/hours`,
    `/opening-hours/restaurant/${restaurantId}`,
    `/restaurants/${restaurantId}`
  ];
  for (const path of candidates) {
    try {
      const result = await apiRequest(path, { auth: !!state.accessToken, retryOn401: false });
      const source = Array.isArray(result) ? result : (result?.hours || result?.openingHours || result?.restaurant?.hours || result?.restaurant?.openingHours || []);
      const normalized = normalizeOpeningHours(source);
      if (normalized.length || path.endsWith(`/${restaurantId}`)) return normalized;
    } catch (error) {}
  }
  const localHours = readJson(`deliveryRestaurantPanel.openingHours.${restaurantId}`);
  return normalizeOpeningHours(localHours || []);
}

function normalizeTime(value) {
  const raw = String(value || '').trim();
  const match = raw.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return '';
  return `${match[1].padStart(2, '0')}:${match[2]}`;
}

function timeToMinutes(value) {
  const [hour, minute] = normalizeTime(value).split(':').map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return (hour * 60) + minute;
}

function getRestaurantOpenInfo(hours) {
  const normalized = normalizeOpeningHours(hours);
  if (!normalized.length) return { isOpen: true, label: 'Horário não informado', todayLabel: 'Horário não informado' };
  const now = new Date();
  const jsDay = now.getDay();
  const today = normalized.filter((item) => item.dayOfWeek === jsDay);
  if (!today.length) return { isOpen: false, label: 'Fechado hoje', todayLabel: 'Hoje: fechado' };
  const nowMinutes = (now.getHours() * 60) + now.getMinutes();
  for (const slot of today) {
    const open = timeToMinutes(slot.openTime);
    const close = timeToMinutes(slot.closeTime);
    if (open === null || close === null) continue;
    const inside = close >= open ? (nowMinutes >= open && nowMinutes < close) : (nowMinutes >= open || nowMinutes < close);
    if (inside) return { isOpen: true, label: `Aberto até ${slot.closeTime}`, todayLabel: `Hoje: ${slot.openTime} às ${slot.closeTime}` };
  }
  const first = today[0];
  return { isOpen: false, label: `Fechado agora • Hoje ${first.openTime} às ${first.closeTime}`, todayLabel: `Hoje: ${first.openTime} às ${first.closeTime}` };
}

function normalizeAddress(item) {
  const cityName = item.city?.name || '';
  const stateCode = item.city?.state?.code || '';
  const neighborhoodName = item.neighborhood?.name || '';
  return {
    ...item,
    cityName,
    neighborhoodName,
    cityId: item.cityId || item.city?.id || '',
    neighborhoodId: item.neighborhoodId || item.neighborhood?.id || '',
    label: item.label || 'Endereço',
    shortText: [`${item.street}, ${item.number}`, neighborhoodName, cityName].filter(Boolean).join(' • '),
    labelText: [item.label || 'Endereço', `${item.street}, ${item.number}`, neighborhoodName, cityName && stateCode ? `${cityName} - ${stateCode}` : cityName].filter(Boolean).join(' • ')
  };
}

function normalizeUser(item) {
  return {
    id: item.id || item.userId || '',
    name: item.name || '',
    email: item.email || '',
    phone: item.phone || ''
  };
}

function findMenuItemById(id) {
  for (const category of state.categories) {
    const found = category.menuItems.find((item) => item.id === id);
    if (found) return found;
  }
  return null;
}

function buildOptionHint(option) {
  const min = option.minSelect ?? (option.required ? 1 : 0);
  const max = option.maxSelect;
  if (max && min) return `Escolha de ${min} até ${max}`;
  if (max) return `Escolha até ${max}`;
  if (min) return `Escolha no mínimo ${min}`;
  return 'Opcional';
}

function toggleModal(modalId, isOpen) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.toggle('hidden', !isOpen);
}

async function apiRequest(path, options = {}) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (options.auth && state.accessToken) headers.Authorization = `Bearer ${state.accessToken}`;

  const response = await fetch(`/proxy${normalizedPath}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  }).catch((error) => {
    throw new Error(error.message || 'Falha ao acessar a API.');
  });

  let payload = null;
  try { payload = await response.json(); } catch (_) {}
  const data = unwrapData(payload);

  if (!response.ok) {
    if (response.status === 401 && options.retryOn401 !== false && state.refreshToken) {
      await refreshSession();
      return apiRequest(path, { ...options, retryOn401: false });
    }
    const apiError = new Error(extractErrorMessage(payload) || `Erro ${response.status}`);
    apiError.status = response.status;
    throw apiError;
  }

  return data;
}

function unwrapData(payload) {
  if (payload && typeof payload === 'object' && 'data' in payload) return payload.data;
  return payload;
}

function unwrapCollection(payload) {
  const data = unwrapData(payload);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.menuItems)) return data.menuItems;
  return [];
}

function extractErrorMessage(payload) {
  const data = unwrapData(payload) || payload;
  if (!data) return '';
  if (typeof data === 'string') return data;
  if (Array.isArray(data.message)) return data.message.join(', ');
  return data.message || data.error || '';
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  el.toastRoot.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
}

function firstName(name) {
  return String(name || '').trim().split(/\s+/)[0] || 'Cliente';
}

function initials(text) {
  return String(text || 'MD').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('') || 'MD';
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
