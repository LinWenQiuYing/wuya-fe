<template>
  <table>
    <tbody>
      <tr>
        <td colspan="2">None(默认)</td>
      </tr>
      <tr>
        <td rowspan="3" style="display: table-cell; vertical-align: middle">Kerberos</td>
        <td>principal</td>
      </tr>
      <tr>
        <td>KUser</td>
      </tr>
      <tr>
        <td>Keytab</td>
      </tr>
      <tr>
        <td rowspan="2" style="display: table-cell; vertical-align: middle">LDAP</td>
        <td>用户名</td>
      </tr>
      <tr>
        <td>密码</td>
      </tr>
      <tr>
        <td>Access Token</td>
        <td>Access Token</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  width: 400px;
  margin: 0 auto;
  border-collapse: collapse;
  border: 2px solid rgb(140 140 140);
  font-size: 14px;
  letter-spacing: 1px;
}

th,
td {
  border: 1px solid rgb(160 160 160);
  padding: 8px 10px;
}
</style>
