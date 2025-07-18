const mysql = require('mysql2/promise');
const { getConnection } = require('../config/database.cjs');

class SulaleService {
    constructor() {
        this.connection = null;
    }

    async getConnection() {
        if (!this.connection) {
            this.connection = await getConnection('101m');
        }
        return this.connection;
    }

    // Kişi ekleme fonksiyonu (tekrarsız ve ilişkiyle)
    kisiEkle(array, iliski, kisi, eklenenler) {
        if (!kisi || !kisi.TC || eklenenler.has(kisi.TC)) return;
        array.push({ iliski, ...kisi });
        eklenenler.add(kisi.TC);
    }

    // Kişinin çocuklarını, torunlarını ve torunun çocuklarını bulur
    async getDescendants(tc, connection, eklenenler, maxDepth = 3, iliski = 'ÇOCUĞU', depth = 1) {
        if (depth > maxDepth) return [];
        const [children] = await connection.execute(
            'SELECT * FROM `101m` WHERE BABATC = ? OR ANNETC = ?',
            [tc, tc]
        );
        let result = [];
        for (const child of children) {
            if (!eklenenler.has(child.TC)) {
                result.push({ iliski, ...child });
                eklenenler.add(child.TC);
                // Torunlar ve alt nesiller
                const altNesil = await this.getDescendants(child.TC, connection, eklenenler, maxDepth, this.getChildRelation(iliski), depth + 1);
                result = result.concat(altNesil);
            }
        }
        return result;
    }

    // İlişkiyi derinliğe göre belirle
    getChildRelation(parentRel) {
        if (parentRel === 'ÇOCUĞU') return 'TORUNU';
        if (parentRel === 'TORUNU') return 'TORUNUNUN ÇOCUĞU';
        if (parentRel === 'TORUNUNUN ÇOCUĞU') return 'TORUNUNUN TORUNU';
        return 'ÇOCUĞU';
    }

    // Kardeşleri bulur (aynı anne ve baba)
    async getSiblings(kisi, connection, eklenenler) {
        if (!kisi.BABATC || !kisi.ANNETC) return [];
        const [siblings] = await connection.execute(
            'SELECT * FROM `101m` WHERE TC != ? AND BABATC = ? AND ANNETC = ?',
            [kisi.TC, kisi.BABATC, kisi.ANNETC]
        );
        let result = [];
        for (const kardes of siblings) {
            if (!eklenenler.has(kardes.TC)) {
                result.push({ iliski: 'KARDEŞİ', ...kardes });
                eklenenler.add(kardes.TC);
            }
        }
        return result;
    }

    // Kardeşin çocukları ve torunları
    async getSiblingDescendants(siblings, connection, eklenenler) {
        let result = [];
        for (const kardes of siblings) {
            // Yeğenler
            const yegenler = await this.getDescendants(kardes.TC, connection, eklenenler, 2, 'YEĞENİ', 1);
            result = result.concat(yegenler);
        }
        return result;
    }

    // Anne/Baba, dede/nine, büyük dede/nine ve onların kardeşleri
    async getAncestors(kisi, connection, eklenenler, maxDepth = 3, iliski = 'BABASI', depth = 1) {
        if (depth > maxDepth) return [];
        let result = [];
        // Baba
        if (kisi.BABATC) {
            const [babaResult] = await connection.execute('SELECT * FROM `101m` WHERE TC = ?', [kisi.BABATC]);
            if (babaResult.length > 0 && !eklenenler.has(babaResult[0].TC)) {
                result.push({ iliski: iliski, ...babaResult[0] });
                eklenenler.add(babaResult[0].TC);
                // Babasının kardeşleri (amca/hala)
                const [babaKardesleri] = await connection.execute(
                    'SELECT * FROM `101m` WHERE TC != ? AND BABATC = ? AND ANNETC = ?',
                    [babaResult[0].TC, babaResult[0].BABATC, babaResult[0].ANNETC]
                );
                for (const amcaHala of babaKardesleri) {
                    if (!eklenenler.has(amcaHala.TC)) {
                        result.push({ iliski: depth === 1 ? 'BABASININ KARDEŞİ' : 'DEDESİNİN KARDEŞİ', ...amcaHala });
                        eklenenler.add(amcaHala.TC);
                    }
                }
                // Dede/nine ve üstü
                const ust = await this.getAncestors(babaResult[0], connection, eklenenler, maxDepth, depth === 1 ? 'DEDESİ' : 'BÜYÜK DEDESİ', depth + 1);
                result = result.concat(ust);
            }
        }
        // Anne
        if (kisi.ANNETC) {
            const [anneResult] = await connection.execute('SELECT * FROM `101m` WHERE TC = ?', [kisi.ANNETC]);
            if (anneResult.length > 0 && !eklenenler.has(anneResult[0].TC)) {
                result.push({ iliski: iliski === 'BABASI' ? 'ANASI' : iliski.replace('BABA', 'ANA') , ...anneResult[0] });
                eklenenler.add(anneResult[0].TC);
                // Annesinin kardeşleri (dayı/teyze)
                const [anneKardesleri] = await connection.execute(
                    'SELECT * FROM `101m` WHERE TC != ? AND BABATC = ? AND ANNETC = ?',
                    [anneResult[0].TC, anneResult[0].BABATC, anneResult[0].ANNETC]
                );
                for (const dayiTeyze of anneKardesleri) {
                    if (!eklenenler.has(dayiTeyze.TC)) {
                        result.push({ iliski: depth === 1 ? 'ANASININ KARDEŞİ' : 'NİNESİNİN KARDEŞİ', ...dayiTeyze });
                        eklenenler.add(dayiTeyze.TC);
                    }
                }
                // Dede/nine ve üstü
                const ust = await this.getAncestors(anneResult[0], connection, eklenenler, maxDepth, depth === 1 ? 'NİNESİ' : 'BÜYÜK NİNESİ', depth + 1);
                result = result.concat(ust);
            }
        }
        return result;
    }

    // Kuzenler (amca/hala ve dayı/teyze çocukları)
    async getCousins(akrabaList, connection, eklenenler) {
        let result = [];
        for (const akraba of akrabaList) {
            const [kuzenler] = await connection.execute(
                'SELECT * FROM `101m` WHERE (BABATC = ? OR ANNETC = ?)',
                [akraba.TC, akraba.TC]
            );
            for (const kuzen of kuzenler) {
                if (!eklenenler.has(kuzen.TC)) {
                    result.push({ iliski: 'KUZENİ', ...kuzen });
                    eklenenler.add(kuzen.TC);
                }
            }
        }
        return result;
    }

    async getSulaleByTC(tc) {
        try {
            const connection = await this.getConnection();
            const eklenenler = new Set();

            // Ana kişi
            const [kisiResult] = await connection.execute('SELECT * FROM `101m` WHERE `TC` = ?', [tc]);
            if (kisiResult.length === 0) return { success: false, message: 'Kişi bulunamadı' };
            const kisi = kisiResult[0];
            eklenenler.add(kisi.TC);

            // Kardeşler
            const kardesler = await this.getSiblings(kisi, connection, eklenenler);
            // Kardeşin çocukları ve torunları (yeğenler)
            const yegenler = await this.getSiblingDescendants(kardesler, connection, eklenenler);

            // Çocuklar, torunlar, torunun çocukları
            const cocuklar = await this.getDescendants(kisi.TC, connection, eklenenler, 3, 'ÇOCUĞU', 1);

            // Anne, baba, dede/nine, büyük dede/nine ve onların kardeşleri
            const atalar = await this.getAncestors(kisi, connection, eklenenler, 3, 'BABASI', 1);

            // Amca/hala ve dayı/teyze (atalar fonksiyonunda ekleniyor)
            const amcaHala = atalar.filter(a => a.iliski === 'BABASININ KARDEŞİ');
            const dayiTeyze = atalar.filter(a => a.iliski === 'ANASININ KARDEŞİ');

            // Kuzenler (amca/hala ve dayı/teyze çocukları)
            const kuzenler = await this.getCousins([...amcaHala, ...dayiTeyze], connection, eklenenler);

            // Dede/nine, büyük dede/nine, üst kuşaklar
            const dedeler = atalar.filter(a => a.iliski.includes('DEDESİ'));
            const nineler = atalar.filter(a => a.iliski.includes('NİNESİ'));
            const buyukler = atalar.filter(a => a.iliski.includes('BÜYÜK'));

            // Sonuç
            return {
                success: true,
                data: {
                    kendisi: { iliski: 'KENDİSİ', ...kisi },
                    kardesler,
                    yegenler,
                    cocuklar,
                    amcaHala,
                    dayiTeyze,
                    kuzenler,
                    dedeler,
                    nineler,
                    buyukler,
                },
                totalCount: eklenenler.size
            };
        } catch (error) {
            console.error('Sülale sorgu hatası:', error);
            return { success: false, message: 'Sülale sorgu hatası: ' + error.message };
        }
    }

    calculateTotalCount(sulale) {
        let count = 0;
        if (sulale.kendisi) count++;
        count += sulale.cocuklari.length;
        count += sulale.kardesleri.length;
        if (sulale.babasi) count++;
        if (sulale.anasi) count++;
        count += sulale.babasininKardesleri.length;
        count += sulale.anasininKardesleri.length;
        if (sulale.babasininBabasi) count++;
        if (sulale.babasininAnasi) count++;
        if (sulale.anasininBabasi) count++;
        if (sulale.anasininAnasi) count++;
        count += sulale.babasininBabasiKardesleri.length;
        count += sulale.anasininAnasiKardesleri.length;
        return count;
    }

    async getSulaleBySoyad(soyad) {
        try {
            const connection = await this.getConnection();
            
            // Soyadına göre kişileri bul
            const [kisilerResult] = await connection.execute(
                'SELECT * FROM `101m` WHERE `SOYADI` LIKE ? LIMIT 100',
                [`%${soyad}%`]
            );

            if (kisilerResult.length === 0) {
                return { success: false, message: 'Bu soyada sahip kişi bulunamadı' };
            }

            const sonuclar = [];
            
            for (const kisi of kisilerResult) {
                const sulale = await this.getSulaleByTC(kisi.TC);
                if (sulale.success) {
                    sonuclar.push({
                        anaKisi: kisi,
                        sulale: sulale.data,
                        totalCount: sulale.totalCount
                    });
                }
            }

            return {
                success: true,
                data: sonuclar,
                totalResults: sonuclar.length
            };

        } catch (error) {
            console.error('Soyad sülale sorgu hatası:', error);
            return { success: false, message: 'Soyad sülale sorgu hatası: ' + error.message };
        }
    }
}

module.exports = new SulaleService(); 