# Neon MCP ile Migration ve Otomasyon Akışı

Bu doküman, veritabanı migration işlemlerinin Neon MCP ile güvenli, test edilebilir ve otomatik şekilde nasıl yönetileceğini özetler.

## 1. Migration Akışı (Önerilen Yol)

1. **Migration SQL'inizi hazırlayın.**
   - Örnek: Yeni tablo, kolon ekleme, veri tipi değiştirme vb.

2. **Geçici Branch'te Migration Testi:**
   - Neon MCP arayüzünden veya doğal dil ile `prepare_database_migration` komutunu kullanarak migration'ı geçici bir branch'te uygulayın.
   - Örnek doğal dil komutu:
     > "users tablosuna phone alanı ekle ve migration'ı test branch'te uygula."

3. **Geçici Branch'te Test:**
   - Migration sonrası ilgili branch'te testlerinizi (ör. SELECT, INSERT, UPDATE) çalıştırın.
   - Her şey yolundaysa ana branch'e aktarılmaya hazırdır.

4. **Ana Branch'e Migration Aktarımı:**
   - `complete_database_migration` komutunu kullanarak değişiklikleri ana branch'e taşıyın.
   - Tüm işlemler otomatik ve güvenli şekilde tamamlanır.

## 2. Örnek Komutlar

- Migration başlatmak için:
  - `prepare_database_migration` ile SQL ve proje bilgisi verilir.
- Ana branch'e geçirmek için:
  - `complete_database_migration` ile migration_id kullanılır.

## 3. Otomasyon ve Entegrasyon

- Migration işlemleri kod değişiklikleriyle entegre edilebilir.
- CI/CD pipeline'ında migration script'leri ve Neon MCP API çağrıları otomatikleştirilebilir.
- Her migration öncesi ve sonrası testler çalıştırılmalı, loglanmalı.

## 4. Dikkat Edilmesi Gerekenler
- Migration'lar her zaman önce geçici branch'te test edilmeli.
- Ana branch'e aktarılan migration'lar geri alınamaz, dikkatli olunmalı.
- Migration sonrası veritabanı şeması ve uygulama kodu uyumlu olmalı.

---

Daha fazla bilgi için Neon MCP dökümantasyonuna veya proje içi örnek migration scriptlerine bakabilirsiniz.
