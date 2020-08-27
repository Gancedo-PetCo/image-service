const axios = require('axios');

const token = require('../config.js').TOKEN;

let getUnsplashImages = () => {
  const promisesArray = [
    'https://images.unsplash.com/photo-1516108282925-3c3c19bc72b2?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1559604138-6ee75709612f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1592507471247-1ba2e60670c0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1567794610436-1cd7b63a9360?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1581467655410-0c2bf55d9d6c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1583791058302-1bb5e93397ce?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1593991910379-b414c1e3bd74?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1543523195-e0613799d7ad?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1586889168149-284ae1263642?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1585948010778-3dd336d7d92f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1530201029781-9ea4233e7ae4?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1497994139250-caecb78f9df9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1497994187231-bc847a69dc76?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1497993950456-cdb57afd1cf1?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1522039553440-46d3e1e61e4a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1591581501796-4c9d7722daa6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1587354004405-bbce24c893c8?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1566955014039-f43848bba2c8?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1557161121-ddf1ba9644c4?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1591907235917-3da27ce1421d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1522260448087-a56a0fd5282e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1573579016624-dc0137d1c2a9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1540926086859-ffa51e146f8f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1585525687320-dd792fcad301?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1564083955490-481b54fa5ad8?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1569780059009-a20bac8da2e7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1526347783277-d3687cb6ef35?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1559321966-04643588828f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1511533752480-6e9a3c835597?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1549308423-a9b1b61cd4b1?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1564915980525-f048e819dccb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1595810404285-3b522aacb8e3?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1556066354-0eab05c2c693?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1596748994414-b63eee17f784?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1561495376-dc9c7c5b8726?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1506551109886-6101f48c1ab9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1561488337-43f10c515a13?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1437957146754-f6377debe171?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1510123193946-4a9db885cbe5?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1552401601-33db828218aa?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1563497425252-36b755215241?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1567016724100-bf1301e1cc4b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1596797882870-8c33deeac224?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1560318315-7bf4cc3f48eb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1561774710-457835b0992b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1591446990032-867d4dbfa7fb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1566847438217-76e82d383f84?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1548907084-a7e5f11d229d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1597626133612-d9977d3eec18?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1565560681116-2d88287ff472?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1597626133663-53df9633b799?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1578339850459-76b0ac239aa2?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1597626291228-324a4c8dcc58?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1597626291233-73dfa25093eb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1597626133622-5dae31154ee3?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1597626133616-2c2d85c96e7e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1575931642133-b0e7ebd0cb68?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1597626133661-bd9d41e24bc8?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1597626133616-83f58a2cc17c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1509281464766-6cb93704023d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1578131282716-e491514338ad?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1597626259989-a11e97b7772d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1571902463832-1f3e615b9a44?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1597626133683-f276350b1036?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1520315342629-6ea920342047?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1551951331-ab2b34be0298?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1490650034439-fd184c3c86a5?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1597626133623-17d731f4c3b9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1597626133628-c143ef7296e7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1559750370-a582f9b68fe7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1596283884979-90cb459c4b02?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1592242431350-c434285d9223?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1575327513944-071d262e2849?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1585030488081-76394a9b8141?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1558017573-aaaed670f328?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1594719167467-ffc6f3bb92ab?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1568018862773-095c6b9de018?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1570117268106-8e369647c733?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1590305425145-54eae671f205?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1562794802-36070c280ac2?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1570461121477-846eadb013b6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1597626259964-6ebee8b88b70?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1570824104629-1817c91f7d1d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1597626259932-62ecbf2a7c18?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1584266337374-c81838cc09cc?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1570117267998-63272030c1c3?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1597626259965-340f9f3359cc?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1589028844312-f7f1c1d8f83f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1588948225762-181a6d9bc90e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1592758596178-fcc24f9540db?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1595802617908-f16c5457e30d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1573594754013-90250c5edefa?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1572513881174-928dc1975198?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1580047136651-034e8eca0c46?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1565560734170-7d30933e6904?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1565560681175-99ae21e26ce1?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1570824103090-72cf4906868c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
    'https://images.unsplash.com/photo-1570824103960-1a04c7a170ec?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE0MzcyOX0',
  ];
  //DELETE AND UNCOMMENT
  // const promisesArray = [];

  // for (let i = 1; i <= 10; i++) {
  //   let options = {
  //     method: 'get',
  //     url: `https://api.unsplash.com/search/photos?query=puppy&page=${i}&per_page=25`,
  //     headers: {
  //       'Authorization': `Client-ID ${token}`,
  //       'Accept-Version': 'v1'
  //     }
  //   }

  //   promisesArray.push(axios(options));
  // }

  // for (let i = 1; i <= 10; i++) {
  //   let options = {
  //     method: 'get',
  //     url: `https://api.unsplash.com/search/photos?query=kitten&page=${i}&per_page=25`,
  //     headers: {
  //       'Authorization': `Client-ID ${token}`,
  //       'Accept-Version': 'v1'
  //     }
  //   }

  //   promisesArray.push(axios(options));
  // }

  return Promise.all(promisesArray)
    .then(responses => {
      const urls = [];
      //DELETE AND UNCOMMENT
      // for (let response of responses) {
      //   const { results } = response.data;

      //   for (let result of results) {
      //     const { regular } = result.urls;
      //     const splitThatRemovesQueries = regular.split('?');
      //     const indexStartOfUniquePhotoId = splitThatRemovesQueries[0].indexOf('-')
      //     const uniquePhotoId = splitThatRemovesQueries[0].substring(indexStartOfUniquePhotoId + 1);
      //     urls.push(uniquePhotoId);
      //   }
      // }

      for (let response of responses) {

        const splitThatRemovesQueries = response.split('?');
        const indexStartOfUniquePhotoId = splitThatRemovesQueries[0].indexOf('-');
        const uniquePhotoId = splitThatRemovesQueries[0].substring(indexStartOfUniquePhotoId + 1);
        urls.push(uniquePhotoId);

      }

      return urls;
    });
};

module.exports.getUnsplashImages = getUnsplashImages;
