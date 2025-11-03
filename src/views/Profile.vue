<template>
  <div class="form-card">
    <h2 style="margin-top:0;">My Profile</h2>
    <p><b>Email:</b> {{ auth.email || '—' }}</p>
    <p><b>Logged in:</b> {{ auth.isAuthenticated ? 'Yes' : 'No' }}</p>
  </div>
</template>