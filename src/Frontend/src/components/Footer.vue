<template>
  <v-footer color="#0B0F19" border="t" class="py-6 mt-12">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <div class="d-flex align-center mb-3">
            <v-icon icon="mdi-car-turbocharger" color="primary" class="mr-2"></v-icon>
            <span class="text-h6 font-weight-bold text-white">AUTOPARTS PRO</span>
          </div>
          <p class="text-body-2 text-grey">
            Profesjonalny sklep z częściami do samochodów osobowych i dostawczych.
            Oryginalne części OEM oraz sprawdzone zamienniki wiodących marek.
          </p>
          <div class="d-flex mt-3">
            <v-chip size="small" color="primary" variant="outlined" class="mr-2">Gwarancja 24m</v-chip>
            <v-chip size="small" color="secondary" variant="outlined" class="mr-2">Wysyłka 24h</v-chip>
            <v-chip size="small" color="success" variant="outlined">Łatwy zwrot 30 dni</v-chip>
          </div>
        </v-col>

        <v-col cols="6" md="2">
          <div class="text-subtitle-1 font-weight-bold text-white mb-2">Kategorie</div>
          <div class="d-flex flex-column gap-1 text-caption text-grey">
            <span class="cursor-pointer hover-text">Układ Hamulcowy</span>
            <span class="cursor-pointer hover-text">Zawieszenie i Amortyzatory</span>
            <span class="cursor-pointer hover-text">Filtry i Oleje silnikowe</span>
            <span class="cursor-pointer hover-text">Rozrząd i Silnik</span>
            <span class="cursor-pointer hover-text">Układ Zapłonowy</span>
          </div>
        </v-col>

        <v-col cols="6" md="3">
          <div class="text-subtitle-1 font-weight-bold text-white mb-2">Technologie i Architektura</div>
          <div class="d-flex flex-column gap-1 text-caption text-grey">
            <span>• ASP.NET Core (.NET 10) & Entity Framework</span>
            <span>• gRPC & gRPC-Web (Protobuf contracts)</span>
            <span>• SignalR Real-time Hub Updates</span>
            <span>• YARP Reverse Proxy (/identity, /portal, /api)</span>
            <span>• Keycloak Authority & PostgreSQL DB</span>
            <span>• Vue 3, TypeScript, Pinia, Vuetify 3</span>
          </div>
        </v-col>

        <v-col cols="12" md="3">
          <div class="text-subtitle-1 font-weight-bold text-white mb-2">Kontakt i Pomoc</div>
          <div class="text-body-2 text-grey mb-1">
            <v-icon icon="mdi-phone" size="18" class="mr-1"></v-icon>
            Infolinia: +48 22 123 45 67
          </div>
          <div class="text-body-2 text-grey mb-1">
            <v-icon icon="mdi-email" size="18" class="mr-1"></v-icon>
            pomoc@autopartspro.local
          </div>
          <div class="text-body-2 text-grey">
            <v-icon icon="mdi-clock-outline" size="18" class="mr-1"></v-icon>
            Pn - Pt: 8:00 - 18:00, Sob: 9:00 - 14:00
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-6 border-opacity-25"></v-divider>

      <div class="d-flex flex-column flex-sm-row justify-space-between align-center text-caption text-grey">
        <span>© 2026 AutoParts Pro Sp. z o.o. Wszelkie prawa zastrzeżone.</span>
        <span>Zintegrowana bramka YARP + Keycloak Authority + PostgreSQL + Docker Compose</span>
      </div>
    </v-container>
  </v-footer>
</template>

<style scoped>
.gap-1 {
  gap: 6px;
}
.hover-text:hover {
  color: #fff;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
