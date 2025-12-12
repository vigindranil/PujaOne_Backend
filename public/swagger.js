window.onload = function () {
  const headerHTML = `
    <div class="pujaone-header">
      <img src="/public/swagger-logo.png" alt="PujaOne Logo" />
      <div>
        <div class="pujaone-header-title">PujaOne API</div>
        <div class="pujaone-header-subtitle">Clean & Professional API Documentation</div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', headerHTML);
};
