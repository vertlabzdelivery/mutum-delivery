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
  restaurantHoursById: {},
  needsAddressSetup: false,
  mobileCartOpen: false,
  pendingOrderPayload: null,
  currentPhoneVerificationId: '',
  currentPhoneVerificationChannel: 'SMS',
  passwordRecoverySessionId: '',
  passwordRecoveryResetToken: '',
  couponsDashboard: null,
  activeCouponValidation: null,
  lastCouponValidatedCode: ''
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
  orderNotesHint: document.getElementById('orderNotesHint'),
  couponCodeInput: document.getElementById('couponCodeInput'),
  applyCouponBtn: document.getElementById('applyCouponBtn'),
  clearCouponBtn: document.getElementById('clearCouponBtn'),
  couponFeedback: document.getElementById('couponFeedback'),
  cartItems: document.getElementById('cartItems'),
  cartEmpty: document.getElementById('cartEmpty'),
  subtotalValue: document.getElementById('subtotalValue'),
  deliveryFeeValue: document.getElementById('deliveryFeeValue'),
  discountValue: document.getElementById('discountValue'),
  totalValue: document.getElementById('totalValue'),
  quoteBtn: document.getElementById('quoteBtn'),
  submitOrderBtn: document.getElementById('submitOrderBtn'),
  configModal: document.getElementById('configModal'),
  profileModal: document.getElementById('profileModal'),
  ordersBtn: document.getElementById('ordersBtn'),
  couponsBtn: document.getElementById('couponsBtn'),
  ordersModal: document.getElementById('ordersModal'),
  ordersList: document.getElementById('ordersList'),
  couponsModal: document.getElementById('couponsModal'),
  couponsContent: document.getElementById('couponsContent'),
  orderDetailsModal: document.getElementById('orderDetailsModal'),
  orderDetailsContent: document.getElementById('orderDetailsContent'),
  profileName: document.getElementById('profileName'),
  profilePhone: document.getElementById('profilePhone'),
  profilePhoneStatus: document.getElementById('profilePhoneStatus'),
  profileAddress: document.getElementById('profileAddress'),
  openPhoneVerificationFromProfileBtn: document.getElementById('openPhoneVerificationFromProfileBtn'),
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
  toastRoot: document.getElementById('toastRoot'),
  bootSplash: document.getElementById('bootSplash'),
  bootSplashText: document.getElementById('bootSplashText'),
  globalLoader: document.getElementById('globalLoader'),
  globalLoaderText: document.getElementById('globalLoaderText'),
  mobileCartFab: document.getElementById('mobileCartFab'),
  mobileCartCount: document.getElementById('mobileCartCount'),
  mobileCartBackdrop: document.getElementById('mobileCartBackdrop'),
  mobileCartCloseBtn: document.getElementById('mobileCartCloseBtn'),
  phoneVerificationModal: document.getElementById('phoneVerificationModal'),
  phoneVerificationMessage: document.getElementById('phoneVerificationMessage'),
  phoneVerificationPhoneInput: document.getElementById('phoneVerificationPhoneInput'),
  phoneVerificationCodeInput: document.getElementById('phoneVerificationCodeInput'),
  sendPhoneVerificationBtn: document.getElementById('sendPhoneVerificationBtn'),
  confirmPhoneVerificationBtn: document.getElementById('confirmPhoneVerificationBtn'),
  openForgotPasswordBtn: document.getElementById('openForgotPasswordBtn'),
  passwordRecoveryModal: document.getElementById('passwordRecoveryModal'),
  passwordRecoveryMessage: document.getElementById('passwordRecoveryMessage'),
  passwordRecoveryPhoneStep: document.getElementById('passwordRecoveryPhoneStep'),
  passwordRecoveryCodeStep: document.getElementById('passwordRecoveryCodeStep'),
  passwordRecoveryResetStep: document.getElementById('passwordRecoveryResetStep'),
  passwordRecoveryPhoneInput: document.getElementById('passwordRecoveryPhoneInput'),
  passwordRecoveryCodeInput: document.getElementById('passwordRecoveryCodeInput'),
  passwordRecoveryNewPasswordInput: document.getElementById('passwordRecoveryNewPasswordInput'),
  passwordRecoveryConfirmPasswordInput: document.getElementById('passwordRecoveryConfirmPasswordInput'),
  sendPasswordRecoveryCodeBtn: document.getElementById('sendPasswordRecoveryCodeBtn'),
  resendPasswordRecoveryCodeBtn: document.getElementById('resendPasswordRecoveryCodeBtn'),
  confirmPasswordRecoveryCodeBtn: document.getElementById('confirmPasswordRecoveryCodeBtn'),
  resetPasswordBtn: document.getElementById('resetPasswordBtn')
};

init();

async function init() {
  bindEvents();
  updateHeader();
  setAuthMode('login');
  updateOrderNotesHint();
  handleViewportChange();
  try {
    if (state.accessToken) {
      await bootstrapAuthenticatedArea();
    } else {
      showAuthOnly();
    }
  } finally {
    setBooting(false);
  }
}

function bindEvents() {
  el.loginForm.addEventListener('submit', handleLogin);
  el.registerForm?.addEventListener('submit', handleRegister);
  el.showLoginBtn?.addEventListener('click', () => setAuthMode('login'));
  el.showRegisterBtn?.addEventListener('click', () => setAuthMode('register'));
  el.openForgotPasswordBtn?.addEventListener('click', openPasswordRecoveryModal);
  el.sendPasswordRecoveryCodeBtn?.addEventListener('click', handlePasswordRecoverySendCode);
  el.resendPasswordRecoveryCodeBtn?.addEventListener('click', handlePasswordRecoverySendCode);
  el.confirmPasswordRecoveryCodeBtn?.addEventListener('click', handlePasswordRecoveryConfirmCode);
  el.resetPasswordBtn?.addEventListener('click', handlePasswordRecoveryResetPassword);
  el.logoutBtn?.addEventListener('click', () => logout(true));
  el.profileBtn?.addEventListener('click', openProfileModal);
  el.openPhoneVerificationFromProfileBtn?.addEventListener('click', () => openPhoneVerificationModal());
  el.ordersBtn?.addEventListener('click', openOrdersModal);
  el.couponsBtn?.addEventListener('click', openCouponsModal);
  el.ordersList?.addEventListener('click', handleOrdersListClick);
  el.couponsContent?.addEventListener('click', handleCouponsPanelClick);
  el.headerAddressBtn?.addEventListener('click', openAddressModal);
  el.backToRestaurantsBtn?.addEventListener('click', () => openRestaurantListView(true));
  el.stateSelect?.addEventListener('change', handleStateChange);
  el.citySelect?.addEventListener('change', handleCityChange);
  el.saveAddressBtn?.addEventListener('click', saveAddress);
  el.openAddAddressBtn?.addEventListener('click', openAddressFormModal);
  el.reloadBtn?.addEventListener('click', async (event) => {
    await runWithButtonLoading(event.currentTarget, 'Recarregando...', async () => {
      setGlobalLoading(true, 'Atualizando restaurantes e cardápio...');
      try {
        await loadRestaurantsByAddress();
        await loadSelectedRestaurantCatalog();
        showToast('Dados recarregados.', 'success');
      } finally {
        setGlobalLoading(false);
      }
    });
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
  el.applyCouponBtn?.addEventListener('click', applyCouponPreview);
  el.clearCouponBtn?.addEventListener('click', clearCouponState);
  el.couponCodeInput?.addEventListener('input', handleCouponInputChanged);
  el.submitOrderBtn.addEventListener('click', submitOrder);
  el.sendPhoneVerificationBtn?.addEventListener('click', sendPhoneVerificationCode);
  el.confirmPhoneVerificationBtn?.addEventListener('click', confirmPhoneVerificationCode);
  el.paymentMethodSelect.addEventListener('change', updateOrderNotesHint);
  el.mobileCartFab?.addEventListener('click', () => setMobileCartOpen(!state.mobileCartOpen));
  el.mobileCartBackdrop?.addEventListener('click', () => setMobileCartOpen(false));
  el.mobileCartCloseBtn?.addEventListener('click', () => setMobileCartOpen(false));
  window.addEventListener('resize', handleViewportChange);
  window.addEventListener('orientationchange', handleViewportChange);
  document.querySelectorAll('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', () => toggleModal(button.dataset.closeModal, false));
  });
  document.addEventListener('click', (event) => {
    const modal = event.target.closest('.modal');
    if (modal && event.target === modal) modal.classList.add('hidden');
  });
}


function setBooting(isBooting, message = 'Preparando sua experiência...') {
  document.body.classList.toggle('app-booting', isBooting);
  if (el.bootSplash) el.bootSplash.classList.toggle('hidden', !isBooting);
  if (el.bootSplashText) el.bootSplashText.textContent = message;
}


function isMobileViewport() {
  return window.matchMedia('(max-width: 860px)').matches;
}

function handleViewportChange() {
  if (!isMobileViewport()) {
    state.mobileCartOpen = false;
  }
  document.body.classList.toggle('mobile-cart-open', Boolean(state.mobileCartOpen && isMobileViewport()));
  renderCart();
  updateHeaderAddress();
}

function setMobileCartOpen(isOpen) {
  const canOpen = Boolean(isOpen && state.currentView === 'detail' && isMobileViewport());
  state.mobileCartOpen = canOpen;
  document.body.classList.toggle('mobile-cart-open', canOpen);
  el.mobileCartBackdrop?.classList.toggle('hidden', !canOpen);
  el.mobileCartFab?.setAttribute('aria-expanded', canOpen ? 'true' : 'false');
}

function updateMobileCartFab() {
  const visible = state.currentView === 'detail' && isMobileViewport();
  el.mobileCartFab?.classList.toggle('hidden', !visible);
  if (!visible) {
    el.mobileCartBackdrop?.classList.add('hidden');
    document.body.classList.remove('mobile-cart-open');
    return;
  }
  const count = state.cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  if (el.mobileCartCount) {
    el.mobileCartCount.textContent = String(count);
    el.mobileCartCount.classList.toggle('hidden', count <= 0);
  }
  const total = state.cart.reduce((sum, item) => sum + (Number(item.totalUnitPrice || 0) * Number(item.quantity || 0)), 0) + Number(state.deliveryFee || 0);
  const label = count > 0 ? `Abrir carrinho com ${count} ${count === 1 ? 'item' : 'itens'} • total ${formatCurrency(total)}` : 'Abrir carrinho';
  el.mobileCartFab?.setAttribute('aria-label', label);
  el.mobileCartFab?.setAttribute('title', count > 0 ? `Carrinho • ${formatCurrency(total)}` : 'Carrinho');
}

function setGlobalLoading(isLoading, message = 'Aguarde um instante...') {
  if (el.globalLoader) el.globalLoader.classList.toggle('hidden', !isLoading);
  if (el.globalLoaderText) el.globalLoaderText.textContent = message;
}

function setButtonLoading(button, isLoading, text = 'Carregando...') {
  if (!button) return;
  if (isLoading) {
    if (!button.dataset.originalHtml) button.dataset.originalHtml = button.innerHTML;
    button.classList.add('is-loading');
    button.disabled = true;
    button.innerHTML = `<span class="inline-spinner" aria-hidden="true"></span>${escapeHtml(text)}`;
    return;
  }
  if (button.dataset.originalHtml) button.innerHTML = button.dataset.originalHtml;
  button.classList.remove('is-loading');
  button.disabled = false;
}

async function runWithButtonLoading(button, text, task) {
  setButtonLoading(button, true, text);
  try {
    return await task();
  } finally {
    setButtonLoading(button, false);
  }
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
  const text = address
    ? address.shortText
    : (state.currentUser
      ? 'Cadastre seu endereço para começar a pedir.'
      : 'Escolha um endereço para ver os restaurantes.');
  el.headerAddressText.textContent = text;
  el.headerAddressBtn?.setAttribute('title', text);
  el.headerAddressBtn?.setAttribute('aria-label', `Selecionar endereço. ${text}`);
}

function openProfileModal() {
  const address = state.addresses.find((item) => item.id === state.selectedAddressId);
  el.profileName.textContent = state.currentUser?.name || '-';
  el.profilePhone.textContent = state.currentUser?.phone || '-';
  el.profilePhoneStatus.textContent = state.currentUser?.isPhoneVerified || state.currentUser?.phoneVerifiedAt ? 'Sim' : 'Não';
  el.profileAddress.textContent = address?.labelText || 'Nenhum endereço selecionado';
  toggleModal('profileModal', true);
}

async function openCouponsModal() {
  if (!state.accessToken || !state.currentUser) {
    showToast('Entre na sua conta para ver seus cupons.', 'info');
    return;
  }
  toggleModal('couponsModal', true);
  if (el.couponsContent) {
    el.couponsContent.innerHTML = '<div class="empty">Carregando seus cupons...</div>';
  }
  try {
    await loadCouponsDashboard();
  } catch (error) {
    if (el.couponsContent) {
      el.couponsContent.innerHTML = `<div class="empty">${escapeHtml(error.message || 'Não foi possível carregar seus cupons agora.')}</div>`;
    }
  }
}

async function loadCouponsDashboard(force = false) {
  if (!state.accessToken) throw new Error('Sessão não encontrada.');
  if (state.couponsDashboard && !force) {
    renderCouponsDashboard();
    return state.couponsDashboard;
  }

  const [referralCodeResult, rewardsResult, historyResult, publicCouponsResult] = await Promise.all([
    apiRequest('/me/referral-code', { auth: true, retryOn401: true }).catch(() => ({ referralCode: null })),
    apiRequest('/me/referral-rewards', { auth: true, retryOn401: true }).catch(() => ({ summary: {}, data: [] })),
    apiRequest('/me/referral-history', { auth: true, retryOn401: true }).catch(() => ({ referredUsers: [], usedReferrals: [] })),
    apiRequest('/coupons/public?limit=20', { retryOn401: false }).catch(() => ({ data: [], pagination: null }))
  ]);

  state.couponsDashboard = {
    referralCode: referralCodeResult?.referralCode || referralCodeResult?.code || null,
    rewardsSummary: rewardsResult?.summary || {},
    rewards: unwrapCollection(rewardsResult?.data || rewardsResult),
    history: historyResult || { referredUsers: [], usedReferrals: [] },
    publicCoupons: unwrapCollection(publicCouponsResult),
    publicPagination: publicCouponsResult?.pagination || null
  };
  renderCouponsDashboard();
  return state.couponsDashboard;
}

function renderCouponsDashboard() {
  if (!el.couponsContent) return;
  const dashboard = state.couponsDashboard || {};
  const referralCode = dashboard.referralCode || state.currentUser?.referralCode || '';
  const rewards = Array.isArray(dashboard.rewards) ? dashboard.rewards : [];
  const summary = dashboard.rewardsSummary || {};
  const publicCoupons = Array.isArray(dashboard.publicCoupons) ? dashboard.publicCoupons : [];
  const history = dashboard.history || {};
  const availableRewards = rewards.filter((item) => String(item.status || '').toUpperCase() === 'AVAILABLE');
  const pendingRewards = rewards.filter((item) => String(item.status || '').toUpperCase() === 'PENDING');
  const usedRewards = rewards.filter((item) => String(item.status || '').toUpperCase() === 'USED');
  const referredUsers = Array.isArray(history.referredUsers) ? history.referredUsers : [];
  const usedReferrals = Array.isArray(history.usedReferrals) ? history.usedReferrals : [];

  el.couponsContent.innerHTML = `
    <section class="coupon-modal-layout">
      <article class="coupon-hero-card">
        <div>
          <span class="coupon-section-eyebrow">Seu código de indicação</span>
          <h4>${escapeHtml(referralCode || 'Ainda não disponível')}</h4>
          <p>Compartilhe seu código. Quando um novo cliente fizer o primeiro pedido com ele, você ganha um cupom de recompensa para usar depois.</p>
        </div>
        <div class="coupon-hero-actions">
          <button class="primary-btn" type="button" data-copy-referral-code="${escapeAttribute(referralCode)}" ${referralCode ? '' : 'disabled'}>Copiar código</button>
          <button class="ghost-btn" type="button" data-refresh-coupons>Atualizar</button>
        </div>
      </article>

      <article class="coupon-card">
        <div class="section-head compact-head">
          <div>
            <h4>Cupons promocionais do momento</h4>
            <p class="muted">Descontos públicos criados pelo administrador.</p>
          </div>
        </div>
        <div class="coupon-list">
          ${publicCoupons.length ? publicCoupons.map(renderPublicCouponCard).join('') : '<div class="empty">Nenhum cupom ativo no momento.</div>'}
        </div>
      </article>

      <div class="coupon-grid-two">
        <article class="coupon-card">
          <div class="section-head compact-head">
            <div>
              <h4>Cupons liberados para você</h4>
              <p class="muted">Use estes códigos no checkout quando quiser.</p>
            </div>
          </div>
          <div class="coupon-list">
            ${availableRewards.length ? availableRewards.map(renderRewardCouponCard).join('') : '<div class="empty">Você ainda não tem cupons liberados.</div>'}
          </div>
        </article>

        <article class="coupon-card">
          <div class="section-head compact-head">
            <div>
              <h4>Histórico de indicações</h4>
              <p class="muted">Acompanhe quem já gerou recompensa e quais cupons ainda estão em processamento.</p>
            </div>
          </div>
          <div class="coupon-list compact-list">
            ${referredUsers.length ? referredUsers.map(renderReferralOwnerHistoryCard).join('') : '<div class="empty">Você ainda não tem indicações registradas.</div>'}
          </div>
        </article>
      </div>

      <article class="coupon-card coupon-stats-card">
        <div class="coupon-mini-stats">
          <div><span>Liberados</span><strong>${escapeHtml(summary.available ?? availableRewards.length)}</strong></div>
          <div><span>Aguardando computar</span><strong>${escapeHtml(summary.pending ?? pendingRewards.length)}</strong></div>
          <div><span>Indicações confirmadas</span><strong>${escapeHtml(referredUsers.length)}</strong></div>
          <div><span>Cupons usados</span><strong>${escapeHtml(summary.used ?? usedRewards.length)}</strong></div>
          <div><span>Você já usou um código</span><strong>${escapeHtml(usedReferrals.length ? 'Sim' : 'Não')}</strong></div>
        </div>
      </article>
    </section>
  `;
}

function renderPublicCouponCard(coupon) {
  const code = coupon.code || '';
  const remaining = Number(coupon.remainingUses ?? Math.max(0, Number(coupon.maxUses || 0) - Number(coupon.usedCount || 0)));
  const discountLabel = coupon.discountType === 'FIXED'
    ? formatCurrency(coupon.discountValue || 0)
    : `${Number(coupon.discountValue || 0)}%`;
  const capLabel = Number(coupon.maxDiscountAmount || 0) > 0 ? `até ${formatCurrency(coupon.maxDiscountAmount)}` : 'sem teto';
  const minimum = Number(coupon.minOrderAmount || 0) > 0 ? `Pedido mínimo ${formatCurrency(coupon.minOrderAmount)}` : 'Sem pedido mínimo';
  const validity = coupon.endsAt ? `Válido até ${formatDateTime(coupon.endsAt)}` : 'Sem data de expiração';
  return `
    <article class="coupon-item-card promotional">
      <div class="coupon-item-head">
        <strong>${escapeHtml(code)}</strong>
        <span class="coupon-chip">${escapeHtml(discountLabel)}</span>
      </div>
      <div class="coupon-item-meta">${escapeHtml(capLabel)} • ${escapeHtml(minimum)}</div>
      <div class="coupon-item-meta">${escapeHtml(validity)}</div>
      <div class="coupon-item-foot">
        <span>${escapeHtml(`${remaining} uso(s) disponível(is)`)}</span>
        <button class="ghost-btn small" type="button" data-fill-coupon="${escapeAttribute(code)}">Usar no pedido</button>
      </div>
    </article>
  `;
}

function renderRewardCouponCard(reward) {
  const code = reward.code || '';
  const discountLabel = reward.discountType === 'FIXED'
    ? formatCurrency(reward.discountValue || 0)
    : `${Number(reward.discountValue || 0)}%`;
  const capLabel = Number(reward.maxDiscountAmount || 0) > 0 ? `até ${formatCurrency(reward.maxDiscountAmount)}` : 'sem teto';
  const sourceName = reward.referralUsage?.referredUser?.name ? `Gerado pela indicação de ${reward.referralUsage.referredUser.name}` : 'Recompensa de indicação confirmada';
  return `
    <article class="coupon-item-card reward">
      <div class="coupon-item-head">
        <strong>${escapeHtml(code)}</strong>
        <span class="coupon-chip">${escapeHtml(discountLabel)}</span>
      </div>
      <div class="coupon-item-meta">${escapeHtml(sourceName)}</div>
      <div class="coupon-item-meta">Desconto ${escapeHtml(capLabel)}</div>
      <div class="coupon-item-foot">
        <span>Disponível para uso</span>
        <button class="ghost-btn small" type="button" data-fill-coupon="${escapeAttribute(code)}">Usar no pedido</button>
      </div>
    </article>
  `;
}

function renderReferralOwnerHistoryCard(item) {
  const status = translateReferralUsageStatus(item.status || 'PENDING');
  const rewardStatus = translateReferralRewardStatus(item.reward?.status || 'PENDING');
  const name = item.referredUser?.name || 'Cliente indicado';
  const granted = item.reward?.grantedAt ? ` • Cupom liberado em ${formatDateTime(item.reward.grantedAt)}` : '';
  return `
    <article class="referral-history-card">
      <strong>${escapeHtml(name)}</strong>
      <div class="coupon-item-meta">${escapeHtml(status)} • Recompensa ${escapeHtml(rewardStatus)}</div>
      <div class="coupon-item-meta">Código usado: ${escapeHtml(item.referralCodeUsed || item.referralCode || 'Código de indicação')} ${escapeHtml(granted)}</div>
    </article>
  `;
}

function handleCouponsPanelClick(event) {
  const refreshBtn = event.target.closest('[data-refresh-coupons]');
  if (refreshBtn) {
    loadCouponsDashboard(true).catch((error) => showToast(error.message || 'Não foi possível atualizar os cupons.', 'error'));
    return;
  }
  const copyBtn = event.target.closest('[data-copy-referral-code]');
  if (copyBtn) {
    const code = String(copyBtn.dataset.copyReferralCode || '').trim();
    if (!code) return;
    copyText(code, 'Seu código foi copiado.');
    return;
  }
  const fillBtn = event.target.closest('[data-fill-coupon]');
  if (fillBtn) {
    const code = String(fillBtn.dataset.fillCoupon || '').trim();
    if (!code) return;
    if (el.couponCodeInput) {
      el.couponCodeInput.value = code;
      state.lastCouponValidatedCode = '';
      state.activeCouponValidation = null;
      renderCart();
    }
    toggleModal('couponsModal', false);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    showToast(`Cupom ${code} pronto para uso no checkout.`, 'success');
  }
}

async function copyText(value, successMessage = 'Código copiado.') {
  try {
    if (!value) throw new Error('Nada para copiar.');
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      const temp = document.createElement('textarea');
      temp.value = value;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      temp.remove();
    }
    showToast(successMessage, 'success');
  } catch (error) {
    showToast('Não foi possível copiar o código agora.', 'error');
  }
}

function normalizeCouponCodeLocal(value) {
  return String(value || '').replace(/\s+/g, '').toUpperCase();
}

function handleCouponInputChanged(event) {
  const normalized = normalizeCouponCodeLocal(event?.target?.value || '');
  if (event?.target && event.target.value !== normalized) event.target.value = normalized;
  if (!normalized) {
    state.activeCouponValidation = null;
    state.lastCouponValidatedCode = '';
    renderCart();
    return;
  }
  if (normalized !== state.lastCouponValidatedCode) {
    state.activeCouponValidation = null;
    renderCart();
  }
}

function getCurrentCouponCode() {
  return normalizeCouponCodeLocal(el.couponCodeInput?.value || '');
}

function getCartSubtotal() {
  return state.cart.reduce((sum, item) => sum + (item.totalUnitPrice * item.quantity), 0);
}

function getCouponDiscountAmount() {
  if (state.activeCouponValidation?.valid) return Number(state.activeCouponValidation.discountAmount || 0);
  if (state.currentQuote?.couponCode) return Number(state.currentQuote.discountAmount || 0);
  return 0;
}

function invalidateCouponPreview() {
  if (!getCurrentCouponCode()) {
    state.activeCouponValidation = null;
    state.lastCouponValidatedCode = '';
    state.currentQuote = null;
    return;
  }
  state.activeCouponValidation = null;
  state.lastCouponValidatedCode = '';
  state.currentQuote = null;
}

function clearCouponState(notify = false) {
  if (el.couponCodeInput) el.couponCodeInput.value = '';
  state.activeCouponValidation = null;
  state.lastCouponValidatedCode = '';
  state.currentQuote = null;
  renderCart();
  if (notify) showToast('Cupom removido do checkout.', 'info');
}

async function applyCouponPreview(event) {
  await runWithButtonLoading(event?.currentTarget || el.applyCouponBtn, 'Validando...', async () => {
    const couponCode = getCurrentCouponCode();
    if (!couponCode) {
      state.activeCouponValidation = null;
      state.lastCouponValidatedCode = '';
      renderCart();
      showToast('Digite um cupom para validar.', 'info');
      return;
    }
    if (!state.accessToken) throw new Error('Entre na sua conta para usar cupons.');
    if (!state.selectedRestaurant?.id) throw new Error('Selecione um restaurante primeiro.');
    const subtotal = getCartSubtotal();
    if (!subtotal) throw new Error('Adicione itens ao carrinho antes de validar o cupom.');

    try {
      const result = await apiRequest('/coupons/validate', {
        method: 'POST',
        auth: true,
        retryOn401: true,
        body: {
          couponCode,
          restaurantId: state.selectedRestaurant.id,
          subtotal,
          deliveryFee: Number(state.deliveryFee || 0)
        }
      });
      state.activeCouponValidation = result;
      state.lastCouponValidatedCode = couponCode;
      state.currentQuote = null;
      renderCart();
      if (result?.valid) {
        showToast(result.message || 'Cupom validado com sucesso.', 'success');
      } else {
        showToast(result?.message || 'Este cupom não pode ser aplicado agora.', 'error');
      }
    } catch (error) {
      state.activeCouponValidation = { valid: false, couponCode, message: error.message || 'Não foi possível validar o cupom agora.' };
      renderCart();
      throw error;
    }
  });
}

function renderCouponFeedback() {
  if (!el.couponFeedback) return;
  const couponCode = getCurrentCouponCode();
  if (!couponCode) {
    el.couponFeedback.innerHTML = '<span>Nenhum cupom aplicado no momento.</span>';
    el.couponFeedback.className = 'coupon-feedback';
    return;
  }
  const validation = state.activeCouponValidation;
  if (validation?.valid && normalizeCouponCodeLocal(validation.couponCode) === couponCode) {
    const label = validation.type === 'PROMOTIONAL'
      ? 'Cupom promocional válido'
      : validation.type === 'REFERRAL_REWARD'
        ? 'Cupom de recompensa válido'
        : 'Cupom de indicação válido';
    el.couponFeedback.innerHTML = `<strong>${escapeHtml(label)}</strong><span>${escapeHtml(validation.message || 'Desconto pronto para uso.')}</span>`;
    el.couponFeedback.className = 'coupon-feedback success';
    return;
  }
  if (validation && normalizeCouponCodeLocal(validation.couponCode) === couponCode) {
    el.couponFeedback.innerHTML = `<strong>Não foi possível aplicar</strong><span>${escapeHtml(validation.message || 'Revise o cupom informado.')}</span>`;
    el.couponFeedback.className = 'coupon-feedback error';
    return;
  }
  if (state.currentQuote?.couponCode && normalizeCouponCodeLocal(state.currentQuote.couponCode) === couponCode) {
    el.couponFeedback.innerHTML = `<strong>Cupom pronto para o pedido</strong><span>O desconto já entrou no resumo do checkout.</span>`;
    el.couponFeedback.className = 'coupon-feedback success';
    return;
  }
  el.couponFeedback.innerHTML = '<span>Valide o cupom para ver o desconto antes de finalizar.</span>';
  el.couponFeedback.className = 'coupon-feedback';
}

function translateReferralUsageStatus(value) {
  const map = { PENDING: 'Aguardando computar', CONFIRMED: 'Indicação confirmada', CANCELED: 'Cancelada', CANCELLED: 'Cancelada', USED: 'Usada' };
  const key = String(value || '').toUpperCase();
  return map[key] || key || 'Pendente';
}

function translateReferralRewardStatus(value) {
  const map = { PENDING: 'pendente', AVAILABLE: 'liberada', USED: 'usada', CANCELED: 'cancelada', CANCELLED: 'cancelada' };
  const key = String(value || '').toUpperCase();
  return map[key] || key.toLowerCase() || 'pendente';
}

function openPhoneVerificationModal(prefillPhone) {
  el.phoneVerificationPhoneInput.value = prefillPhone || state.currentUser?.phone || el.deliveryPhoneInput?.value || '';
  el.phoneVerificationCodeInput.value = '';
  el.phoneVerificationMessage.textContent = 'Vamos confirmar seu telefone antes de finalizar o pedido.';
  state.currentPhoneVerificationId = '';
  state.currentPhoneVerificationChannel = 'SMS';
  toggleModal('phoneVerificationModal', true);
}



function setPasswordRecoveryStep(step) {
  el.passwordRecoveryPhoneStep?.classList.toggle('hidden', step !== 'phone');
  el.passwordRecoveryCodeStep?.classList.toggle('hidden', step !== 'code');
  el.passwordRecoveryResetStep?.classList.toggle('hidden', step !== 'password');
}

function openPasswordRecoveryModal() {
  state.passwordRecoverySessionId = '';
  state.passwordRecoveryResetToken = '';
  if (el.passwordRecoveryPhoneInput) el.passwordRecoveryPhoneInput.value = '';
  if (el.passwordRecoveryCodeInput) el.passwordRecoveryCodeInput.value = '';
  if (el.passwordRecoveryNewPasswordInput) el.passwordRecoveryNewPasswordInput.value = '';
  if (el.passwordRecoveryConfirmPasswordInput) el.passwordRecoveryConfirmPasswordInput.value = '';
  if (el.passwordRecoveryMessage) {
    el.passwordRecoveryMessage.textContent = 'Informe o telefone verificado da conta para receber um código por SMS.';
  }
  setPasswordRecoveryStep('phone');
  toggleModal('passwordRecoveryModal', true);
}

async function handlePasswordRecoverySendCode(event) {
  const phone = el.passwordRecoveryPhoneInput?.value?.trim() || '';
  if (phone.replace(/\D/g, '').length < 10) {
    showToast('Informe um telefone válido com DDD.', 'error');
    return;
  }

  try {
    await runWithButtonLoading(event.currentTarget, 'Enviando...', async () => {
      const result = await apiRequest('/auth/password-recovery/start', {
        method: 'POST',
        retryOn401: false,
        body: { phone },
      });

      state.passwordRecoverySessionId = result.sessionId || '';
      state.passwordRecoveryResetToken = '';
      if (el.passwordRecoveryPhoneInput) el.passwordRecoveryPhoneInput.value = result.phone || phone;
      if (el.passwordRecoveryMessage) {
        el.passwordRecoveryMessage.textContent = result.message || 'Código enviado por SMS.';
      }
      setPasswordRecoveryStep('code');
      showToast('Código enviado por SMS.', 'success');
    });
  } catch (error) {
    showToast(error?.message || 'Não foi possível enviar o código.', 'error');
  }
}

async function handlePasswordRecoveryConfirmCode(event) {
  if (!state.passwordRecoverySessionId) {
    showToast('Solicite um código antes de continuar.', 'error');
    return;
  }

  const code = el.passwordRecoveryCodeInput?.value?.trim() || '';
  if (code.length < 4) {
    showToast('Digite o código recebido por SMS.', 'error');
    return;
  }

  try {
    await runWithButtonLoading(event.currentTarget, 'Confirmando...', async () => {
      const result = await apiRequest('/auth/password-recovery/confirm', {
        method: 'POST',
        retryOn401: false,
        body: { sessionId: state.passwordRecoverySessionId, code },
      });

      state.passwordRecoveryResetToken = result.resetToken || '';
      if (el.passwordRecoveryMessage) {
        el.passwordRecoveryMessage.textContent = result.message || 'Código confirmado. Agora defina sua nova senha.';
      }
      setPasswordRecoveryStep('password');
      showToast('Código confirmado.', 'success');
    });
  } catch (error) {
    showToast(error?.message || 'Não foi possível validar o código.', 'error');
  }
}

async function handlePasswordRecoveryResetPassword(event) {
  const newPassword = el.passwordRecoveryNewPasswordInput?.value || '';
  const confirmPassword = el.passwordRecoveryConfirmPasswordInput?.value || '';

  if (!state.passwordRecoveryResetToken) {
    showToast('Confirme o código antes de alterar a senha.', 'error');
    return;
  }
  if (newPassword.length < 8) {
    showToast('A nova senha precisa ter pelo menos 8 caracteres.', 'error');
    return;
  }
  if (newPassword !== confirmPassword) {
    showToast('As senhas não conferem.', 'error');
    return;
  }

  try {
    await runWithButtonLoading(event.currentTarget, 'Salvando...', async () => {
      const result = await apiRequest('/auth/password-recovery/reset', {
        method: 'POST',
        retryOn401: false,
        body: { resetToken: state.passwordRecoveryResetToken, newPassword },
      });

      toggleModal('passwordRecoveryModal', false);
      setAuthMode('login');
      showToast(result.message || 'Senha alterada com sucesso.', 'success');
    });
  } catch (error) {
    showToast(error?.message || 'Não foi possível alterar a senha.', 'error');
  }
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

async function handleOrdersListClick(event) {
  const card = event.target.closest('.order-card');
  if (!card) return;
  const orderId = card.dataset.orderId;
  const order = state.orders.find((item) => String(item.id || item.orderId || item.uuid) === orderId);
  if (!order) return;
  await openOrderDetails(order);
}

function renderOrderCard(order) {
  const items = unwrapCollection(order.items || order.orderItems || []);
  const preview = items.slice(0, 3).map((item) => item.menuItemName || item.name || item.menuItem?.name).filter(Boolean).join(', ');
  const total = Number(order.totalAmount || order.total || order.grandTotal || 0);
  const status = translateOrderStatus(order.status || 'PENDING');
  const restaurant = order.restaurantName || order.restaurant?.name || 'Restaurante';
  const created = formatDateTime(order.createdAt || order.created_at || order.date);
  const orderId = String(order.id || order.orderId || order.uuid || '');
  const couponCode = order.couponCode || '';
  const discount = Number(order.discountAmount || 0);
  return `
    <article class="order-card" data-order-id="${escapeHtml(orderId)}" role="button" tabindex="0">
      <div class="order-card-head">
        <strong>${escapeHtml(restaurant)}</strong>
        <span class="order-status-badge">${escapeHtml(status)}</span>
      </div>
      <div class="order-items-preview">${escapeHtml(preview || 'Itens do pedido')}</div>
      <div class="restaurant-inline-meta">${escapeHtml(created)} • ${escapeHtml(formatCurrency(total))}</div>
      ${couponCode ? `<div class="order-coupon-note">Cupom ${escapeHtml(couponCode)} aplicado${discount ? ` • desconto ${escapeHtml(formatCurrency(discount))}` : ''}</div>` : ''}
    </article>
  `;
}

async function openOrderDetails(order) {
  const detailedOrder = await fetchOrderDetails(order);
  const items = unwrapCollection(detailedOrder.items || detailedOrder.orderItems || []);
  const payment = translatePaymentMethod(detailedOrder.paymentMethod || detailedOrder.payment || '');
  const deliveryFee = Number(detailedOrder.deliveryFee || detailedOrder.fee || 0);
  const subtotal = Number(detailedOrder.subtotal || detailedOrder.subTotal || detailedOrder.itemsTotal || 0);
  const total = Number(detailedOrder.totalAmount || detailedOrder.total || detailedOrder.grandTotal || 0);
  const discount = Number(detailedOrder.discountAmount || 0);
  const couponCode = detailedOrder.couponCode || null;
  const couponType = detailedOrder.couponType || null;
  const status = translateOrderStatus(detailedOrder.status || 'PENDING');
  const restaurant = detailedOrder.restaurantName || detailedOrder.restaurant?.name || 'Restaurante';
  const created = formatDateTime(detailedOrder.createdAt || detailedOrder.created_at || detailedOrder.date);
  const addressText = extractOrderAddressText(detailedOrder);

  setMobileCartOpen(false);
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
        <div><span>Pagamento</span><strong>${escapeHtml(payment || 'Não informado')}</strong></div>
        <div><span>Entrega</span><strong>${escapeHtml(formatCurrency(deliveryFee))}</strong></div>
        <div><span>Subtotal</span><strong>${escapeHtml(formatCurrency(subtotal))}</strong></div>
        <div><span>Desconto</span><strong>${escapeHtml(discount ? `- ${formatCurrency(discount)}` : formatCurrency(0))}</strong></div>
        <div><span>Total</span><strong>${escapeHtml(formatCurrency(total))}</strong></div>
      </div>
      ${couponCode ? `<div class="order-details-block"><h4>Cupom aplicado</h4><p>${escapeHtml(couponCode)} • ${escapeHtml(couponType === 'PROMOTIONAL' ? 'Promocional' : couponType === 'REFERRAL_REWARD' ? 'Recompensa de indicação' : 'Indicação')}</p></div>` : ''}
      <div class="order-details-block">
        <h4>Itens</h4>
        <div class="order-detail-items">${items.map(renderOrderDetailItem).join('') || '<div class="empty">Nenhum item encontrado.</div>'}</div>
      </div>
      <div class="order-details-block">
        <h4>Entrega</h4>
        <p>${escapeHtml(addressText || 'Endereço não informado.')}</p>
      </div>
      ${detailedOrder.notes || detailedOrder.observations ? `<div class="order-details-block"><h4>Observações</h4><p>${escapeHtml(detailedOrder.notes || detailedOrder.observations)}</p></div>` : ''}
      ${(() => { if (detailedOrder.status !== 'CANCELED') return ''; const h = Array.isArray(detailedOrder.statusHistory) ? detailedOrder.statusHistory.find((e) => e.toStatus === 'CANCELED') : null; const r = h?.note; return r ? `<div class="order-details-block cancel-reason-block"><h4>Motivo do cancelamento</h4><p>${escapeHtml(r)}</p></div>` : ''; })()}
    </div>
  `;
  toggleModal('orderDetailsModal', true);
}

async function fetchOrderDetails(order) {
  const orderId = order?.id || order?.orderId || order?.uuid;
  if (!orderId || !state.accessToken) return order;
  try {
    const detailed = await apiRequest(`/orders/${orderId}`, { auth: true, retryOn401: true });
    return detailed || order;
  } catch (error) {
    return order;
  }
}

function extractOrderAddressText(order) {
  const address = order.address || order.deliveryAddress || order.customerAddress || null;
  const compactAddress = [
    address?.street || order.deliveryStreet,
    address?.number || order.deliveryNumber,
    address?.complement || order.deliveryComplement,
    address?.reference || order.deliveryReference,
    address?.neighborhood?.name || address?.neighborhoodName || address?.district || order.deliveryDistrict,
    address?.city?.name || address?.cityName || order.deliveryCity,
    address?.state?.uf || address?.stateUf || address?.state?.code || order.deliveryState,
    address?.zipCode || order.deliveryZipCode
  ].filter(Boolean);

  return compactAddress.join(' • ') || order.deliveryAddressText || '';
}

function translatePaymentMethod(value) {
  const payment = String(value || '').toUpperCase();
  const map = {
    CASH: 'Dinheiro',
    PIX: 'PIX',
    CREDIT_CARD: 'Cartão de crédito',
    DEBIT_CARD: 'Cartão de débito'
  };
  return map[payment] || String(value || '').replace(/_/g, ' ');
}

function translateOrderStatus(value) {
  const status = String(value || '').toUpperCase();
  const map = {
    PENDING: 'Pendente',
    ACCEPTED: 'Aceito',
    PREPARING: 'Preparando',
    DELIVERY: 'Saiu para entrega',
    DELIVERED: 'Entregue',
    CANCELED: 'Cancelado',
    CANCELLED: 'Cancelado',
    REJECTED: 'Recusado'
  };
  return map[status] || String(value || '').replace(/_/g, ' ');
}

function renderOrderDetailItem(item) {
  const quantity = Number(item.quantity || item.qty || 1);
  const name = item.menuItemName || item.name || item.menuItem?.name || 'Item';
  const notes = item.notes || item.observations || '';
  const lineTotal = Number(item.totalPrice || item.total || item.lineTotal || 0);
  const choices = unwrapCollection(item.selectedChoices || item.choices || item.selections || []);
  const choicesText = choices.map((choice) => choice.choiceName || choice.name || choice.choice?.name || choice.selectionName).filter(Boolean).join(', ');
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
  setGlobalLoading(false);
  setMobileCartOpen(false);
  el.authSection.classList.remove('hidden');
  el.appSection.classList.add('hidden');
}

async function bootstrapAuthenticatedArea() {
  setGlobalLoading(true, 'Carregando sua conta e seus endereços...');
  try {
    await loadCurrentUser();
    const hasAddress = await loadAddresses();
    fillDeliveryFields();
    el.authSection.classList.add('hidden');
    el.appSection.classList.remove('hidden');

    if (!hasAddress) {
      state.needsAddressSetup = true;
      state.restaurants = [];
      state.restaurantBuckets = { available: [], closed: [], cityOnly: [] };
      renderAddressRequiredState();
      openRestaurantListView(true);
      updateHeaderAddress();
      showToast('Cadastre seu primeiro endereço para liberar os restaurantes.', 'info');
      await openAddressFormModal();
      return;
    }

    state.needsAddressSetup = false;
    await loadRestaurantsByAddress();
    openRestaurantListView();
  } catch (error) {
    showToast(error.message || 'Erro ao carregar painel do usuário.', 'error');
    if (error.status === 401) logout(false);
  } finally {
    setGlobalLoading(false);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const formEl = event.currentTarget;
  const form = new FormData(formEl);
  await runWithButtonLoading(event.submitter || formEl.querySelector('button[type="submit"]'), 'Entrando...', async () => {
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
  });
}

async function handleRegister(event) {
  event.preventDefault();
  const formEl = event.currentTarget;
  const form = new FormData(formEl);
  await runWithButtonLoading(event.submitter || formEl.querySelector('button[type="submit"]'), 'Criando conta...', async () => {
    try {
      const result = await apiRequest('/auth/register', { method: 'POST', body: {
        name: String(form.get('name') || '').trim(),
        phone: String(form.get('phone') || '').trim() || undefined,
        email: String(form.get('email') || '').trim(),
        password: String(form.get('password') || '')
      } });
      applyAuth(result);
      formEl.reset();
      await bootstrapAuthenticatedArea();
      showToast('Conta criada e login realizado com sucesso.', 'success');
    } catch (error) {
      showToast(error.message || 'Não foi possível cadastrar.', 'error');
    }
  });
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
  state.couponsDashboard = null;
  state.activeCouponValidation = null;
  state.lastCouponValidatedCode = '';
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
  if (!state.addresses.length) {
    state.selectedAddressId = '';
    renderAddressList();
    updateHeaderAddress();
    return false;
  }
  state.selectedAddressId = state.selectedAddressId && state.addresses.some((item) => item.id === state.selectedAddressId)
    ? state.selectedAddressId
    : (state.addresses.find((item) => item.isDefault)?.id || state.addresses[0].id);
  renderAddressList();
  updateHeaderAddress();
  return true;
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

  const hourEntries = sameCityRestaurants.map((restaurant) => {
    const hours = normalizeOpeningHours(restaurant.hours || restaurant.openingHours || []);
    return [restaurant.id, hours];
  });
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
    clearCouponState(false);
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
  if (!state.addresses.length) {
    el.addressList.innerHTML = `
      <div class="empty-spotlight">
        <h3>Nenhum endereço cadastrado</h3>
        <p>Cadastre seu primeiro endereço para ver os restaurantes que entregam na sua região.</p>
        <button class="primary-btn" type="button" data-open-first-address>Adicionar endereço</button>
      </div>
    `;
    return;
  }
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

function renderAddressRequiredState() {
  el.restaurantSections.innerHTML = `
    <section class="panel empty-spotlight">
      <h3>Falta só o seu endereço</h3>
      <p>Assim que você cadastrar o primeiro endereço, o app libera os restaurantes que atendem a sua região e já deixa tudo pronto para o pedido.</p>
      <button class="primary-btn" type="button" data-open-first-address>Cadastrar endereço</button>
    </section>
  `;
}

function renderRestaurantSections() {
  if (!state.addresses.length) {
    renderAddressRequiredState();
    return;
  }
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
  if (el.restaurantRatingBadge) el.restaurantRatingBadge.textContent = '';
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
  const firstAddressButton = event.target.closest('[data-open-first-address]');
  if (firstAddressButton) {
    openAddressFormModal().catch((error) => showToast(error.message || 'Não foi possível abrir o cadastro de endereço.', 'error'));
    return;
  }

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
    clearCouponState(false);
  }
  state.selectedRestaurant = restaurant;
  openRestaurantDetailView();
  setGlobalLoading(true, 'Abrindo o cardápio do restaurante...');
  loadSelectedRestaurantCatalog().catch((error) => {
    showToast(error.message || 'Não foi possível abrir o restaurante.', 'error');
  }).finally(() => {
    setGlobalLoading(false);
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
  const shouldShowCart = state.currentView === 'detail' && (isMobileViewport() || state.cart.length > 0);
  if (!shouldShowCart) {
    setMobileCartOpen(false);
  }
  el.cartColumn.classList.toggle('hidden', !shouldShowCart);
  if (!state.cart.length) {
    el.cartItems.innerHTML = '';
    el.cartEmpty.innerHTML = `
      <div class="cart-empty-state">
        <div class="cart-empty-emoji" aria-hidden="true">🛒</div>
        <strong>Seu carrinho está vazio</strong>
        <p>Navegue pelo cardápio e escolha seus itens preferidos.</p>
      </div>
    `;
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
  const discountAmount = getCouponDiscountAmount();
  const total = Math.max(0, subtotal + Number(state.deliveryFee || 0) - discountAmount);
  el.subtotalValue.textContent = formatCurrency(subtotal);
  el.deliveryFeeValue.textContent = formatCurrency(state.deliveryFee || 0);
  if (el.discountValue) el.discountValue.textContent = discountAmount ? `- ${formatCurrency(discountAmount)}` : formatCurrency(0);
  el.totalValue.textContent = formatCurrency(total);
  renderCouponFeedback();
  updateMobileCartFab();
}

function handleCartActions(event) {
  const button = event.target.closest('[data-remove-cart-item]');
  if (!button) return;
  state.cart = state.cart.filter((item) => item.uid !== button.dataset.removeCartItem);
  invalidateCouponPreview();
  renderCart();
}

async function quoteOrder(event) {
  await runWithButtonLoading(event?.currentTarget || el.quoteBtn, 'Calculando...', async () => {
    try {
      const payload = buildOrderPayload();
      const quote = await apiRequest('/orders/quote', { method: 'POST', auth: true, retryOn401: true, body: payload });
      state.currentQuote = quote;
      const total = Number(quote.total ?? quote.summary?.total ?? 0);
      const deliveryFee = Number((quote.deliveryFee ?? quote.summary?.deliveryFee ?? state.deliveryFee) || 0);
      state.deliveryFee = deliveryFee;
      if (quote?.couponCode) {
        state.activeCouponValidation = {
          valid: true,
          couponCode: quote.couponCode,
          type: quote.couponType || null,
          discountAmount: Number(quote.discountAmount || 0),
          finalTotalPreview: total,
          message: 'Desconto aplicado ao resumo do pedido.'
        };
        state.lastCouponValidatedCode = normalizeCouponCodeLocal(quote.couponCode);
      } else {
        state.activeCouponValidation = null;
        state.lastCouponValidatedCode = '';
      }
      renderCart();
      if (total) el.totalValue.textContent = formatCurrency(total);
      showToast('Pedido calculado com sucesso.', 'success');
    } catch (error) {
      showToast(error.message || 'Não foi possível calcular o pedido.', 'error');
    }
  });
}

async function submitOrder(event) {
  await runWithButtonLoading(event?.currentTarget || el.submitOrderBtn, 'Enviando pedido...', async () => {
    try {
      const payload = buildOrderPayload();
      if (!(state.currentUser?.isPhoneVerified || state.currentUser?.phoneVerifiedAt)) {
        state.pendingOrderPayload = payload;
        openPhoneVerificationModal(payload.deliveryPhone);
        showToast('Confirme seu telefone antes do primeiro pedido.', 'info');
        return;
      }
      await finalizeOrderPayload(payload);
    } catch (error) {
      if (String(error?.message || '').toLowerCase().includes('telefone precisa ser verificado')) {
        state.pendingOrderPayload = null;
        try { state.pendingOrderPayload = buildOrderPayload(); } catch {}
        openPhoneVerificationModal(el.deliveryPhoneInput?.value || state.currentUser?.phone || '');
        showToast('Confirme seu telefone para concluir o pedido.', 'info');
        return;
      }
      showToast(error.message || 'Não foi possível finalizar o pedido.', 'error');
    }
  });
}

async function finalizeOrderPayload(payload) {
  const result = await apiRequest('/orders', { method: 'POST', auth: true, retryOn401: true, body: payload });
  state.cart = [];
  state.currentQuote = result;
  state.pendingOrderPayload = null;
  state.activeCouponValidation = null;
  state.lastCouponValidatedCode = '';
  if (el.couponCodeInput) el.couponCodeInput.value = '';
  setMobileCartOpen(false);
  renderCart();
  toggleModal('phoneVerificationModal', false);
  if (state.couponsDashboard) loadCouponsDashboard(true).catch(() => {});
  showToast('Pedido enviado com sucesso.', 'success');
  openOrdersModal().catch(() => {});
}

async function sendPhoneVerificationCode(event) {
  await runWithButtonLoading(event?.currentTarget || el.sendPhoneVerificationBtn, 'Enviando...', async () => {
    try {
      const result = await apiRequest('/auth/phone-verification/start', {
        method: 'POST',
        auth: true,
        retryOn401: true,
        body: { phone: el.phoneVerificationPhoneInput.value.trim(), channel: 'SMS' }
      });
      state.currentPhoneVerificationId = result.verificationId;
      state.currentPhoneVerificationChannel = result.channel || 'SMS';
      el.phoneVerificationMessage.textContent = result.message || 'Código enviado com sucesso.';
      showToast(result.message || 'Código enviado.', 'success');
      await loadCurrentUser();
    } catch (error) {
      showToast(error.message || 'Não foi possível enviar o código.', 'error');
    }
  });
}

async function confirmPhoneVerificationCode(event) {
  await runWithButtonLoading(event?.currentTarget || el.confirmPhoneVerificationBtn, 'Confirmando...', async () => {
    try {
      if (!state.currentPhoneVerificationId) throw new Error('Envie o código primeiro.');
      const result = await apiRequest('/auth/phone-verification/confirm', {
        method: 'POST',
        auth: true,
        retryOn401: true,
        body: { verificationId: state.currentPhoneVerificationId, code: el.phoneVerificationCodeInput.value.trim() }
      });
      if (result.user) {
        state.currentUser = normalizeUser(result.user);
        localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(state.currentUser));
      } else {
        await loadCurrentUser();
      }
      updateHeader();
      showToast(result.message || 'Telefone confirmado com sucesso.', 'success');
      if (state.pendingOrderPayload) {
        const pending = state.pendingOrderPayload;
        state.pendingOrderPayload = null;
        await finalizeOrderPayload(pending);
      } else {
        toggleModal('phoneVerificationModal', false);
      }
    } catch (error) {
      showToast(error.message || 'Código inválido.', 'error');
    }
  });
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
  const cashChangeFor = paymentMethod === 'CASH' ? parseCashChangeFromNotes(el.orderNotesInput.value) : undefined;
  if (paymentMethod === 'CASH' && cashChangeFor !== undefined && cashChangeFor < orderTotal) {
    throw new Error('O valor informado para troco nas observações precisa ser maior ou igual ao total do pedido.');
  }

  const payload = {
    restaurantId: state.selectedRestaurant.id,
    userAddressId: state.selectedAddressId,
    paymentMethod,
    notes: el.orderNotesInput.value.trim() || undefined,
    cashChangeFor,
    deliveryName: el.deliveryNameInput.value.trim() || state.currentUser?.name || '',
    deliveryPhone: el.deliveryPhoneInput.value.trim() || state.currentUser?.phone || '',
    couponCode: getCurrentCouponCode() || undefined,
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

function updateOrderNotesHint() {
  const isCash = el.paymentMethodSelect.value === 'CASH';
  if (el.cashChangeInput) el.cashChangeInput.value = '';
  if (el.cashChangeWrap) el.cashChangeWrap.classList.add('hidden');
  if (!el.orderNotesInput) return;
  const placeholder = isCash
    ? 'Precisa de troco? Escreva aqui. Ex.: Troco para 100. Também use este campo para observações do pedido.'
    : 'Alguma observação para o restaurante? Ex.: retirar cebola.';
  el.orderNotesInput.placeholder = placeholder;
  if (el.orderNotesHint) {
    el.orderNotesHint.textContent = isCash
      ? 'Pagando em dinheiro? Escreva aqui se precisa de troco. Ex.: Troco para 100.'
      : 'Alguma observação para o restaurante? Ex.: retirar cebola.';
  }
}

function parseCashChangeFromNotes(value) {
  const text = String(value || '').replace(/,/g, '.');
  const match = text.match(/troco\s*(?:para|p(?:ra)?)?\s*(?:r\$\s*)?(\d+(?:\.\d{1,2})?)/i);
  if (!match) return undefined;
  const amount = Number(match[1]);
  return Number.isFinite(amount) ? amount : undefined;
}

async function handleAddressChange(addressId) {
  state.selectedAddressId = addressId;
  state.cart = [];
  state.selectedRestaurant = null;
  clearCouponState(false);
  renderCart();
  updateHeaderAddress();
  toggleModal('addressModal', false);
  await loadRestaurantsByAddress();
  openRestaurantListView();
}

function openRestaurantListView(clearCart=false) {
  state.currentView = 'list';
  setMobileCartOpen(false);
  if (clearCart) {
    state.cart = [];
    state.currentQuote = null;
    clearCouponState(false);
  }
  renderSelectedRestaurant();
  renderCart();
}

function openRestaurantDetailView() {
  state.currentView = 'detail';
  setMobileCartOpen(false);
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
  if (!state.addresses.length) {
    await openAddressFormModal();
    return;
  }
  toggleModal('addressModal', true);
  renderAddressList();
}

async function openAddressFormModal() {
  resetAddressForm();
  toggleModal('addressModal', state.addresses.length > 0);
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

async function saveAddress(event) {
  const trigger = event?.currentTarget || el.saveAddressBtn;
  await runWithButtonLoading(trigger, state.editingAddressId ? 'Salvando alterações...' : 'Salvando endereço...', async () => {
    try {
      const payload = {
      label: el.addressLabelInput.value.trim() || undefined,
      street: el.addressStreetInput.value.trim(),
      number: el.addressNumberInput.value.trim(),
      complement: el.addressComplementInput.value.trim() || undefined,
      reference: el.addressReferenceInput.value.trim() || undefined,
      zipCode: undefined,
      cityId: el.citySelect.value,
      neighborhoodId: el.neighborhoodSelect.value,
      isDefault: el.addressDefaultInput.checked
    };
    if (!payload.street || payload.street.length < 6 || !payload.number || !payload.cityId || !payload.neighborhoodId) {
      throw new Error(state.editingAddressId ? 'Preencha corretamente os campos do endereço.' : 'Preencha corretamente os campos do novo endereço.');
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
      state.needsAddressSetup = false;
      renderRestaurantSections();
      showToast(isEditing ? 'Endereço alterado com sucesso.' : 'Endereço salvo com sucesso.', 'success');
    } catch (error) {
      showToast(error.message || 'Não foi possível salvar o endereço.', 'error');
    }
  });
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
  if (Array.isArray(cached)) return cached;

  const restaurantFromList = state.restaurants.find((item) => item.id === restaurantId);
  const embeddedHours = normalizeOpeningHours(restaurantFromList?.hours || restaurantFromList?.openingHours || []);
  if (embeddedHours.length) {
    state.restaurantHoursById[restaurantId] = embeddedHours;
    return embeddedHours;
  }

  try {
    const result = await apiRequest(`/restaurants/${restaurantId}`, { auth: false, retryOn401: false });
    const normalized = normalizeOpeningHours(result?.hours || result?.openingHours || result?.restaurant?.hours || result?.restaurant?.openingHours || []);
    state.restaurantHoursById[restaurantId] = normalized;
    return normalized;
  } catch (error) {
    const localHours = readJson(`deliveryRestaurantPanel.openingHours.${restaurantId}`);
    const fallback = normalizeOpeningHours(localHours || []);
    state.restaurantHoursById[restaurantId] = fallback;
    return fallback;
  }
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
    phone: item.phone || '',
    phoneVerifiedAt: item.phoneVerifiedAt || null,
    isPhoneVerified: Boolean(item.isPhoneVerified || item.phoneVerifiedAt)
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs || 20000);
  const response = await fetch(`/proxy${normalizedPath}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: controller.signal
  }).catch((error) => {
    if (error.name === 'AbortError') throw new Error('A requisição demorou demais para responder.');
    throw new Error(error.message || 'Falha ao acessar a API.');
  }).finally(() => {
    clearTimeout(timeoutId);
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
