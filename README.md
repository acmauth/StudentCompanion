## Meet the team ✨
<!-- 
    Apostolos Halis
    Christos Balaktsis
    Dimitra Angelidou
    Konstantinos Agathopoulos
    Michalis Karypidis
    Myrto Gkogkou
    Neron Panagiotopoulos
    Vasilis Michaelidis
 -->
<table>
    <tbody>
        <tr>
            <td align="center" valign="top" width="25%">
                <a href="https://github.com/TolisSth">
                    <img src="https://avatars.githubusercontent.com/u/93685610?v=4?s=100" width="100px;" alt="Apostolos Halis"/>
                    <br />
                    <sub><b>Apostolos Halis</b></sub>
                </a>
            </td>
            <td align="center" valign="top" width="25%">
                <a href="https://github.com/balaktsisc">
                    <img src="https://avatars.githubusercontent.com/u/74056421?v=4?s=100" width="100px;" alt="Christos Balaktsis"/>
                    <br />
                    <sub><b>Christos Balaktsis</b></sub>
                </a>
            </td>
            <td align="center" valign="top" width="25%">
                <a href="https://github.com/dangelidou">
                    <img src="https://avatars.githubusercontent.com/u/115474360?v=4?s=100" width="100px;" alt="Dimitra Angelidou"/>
                    <br />
                    <sub><b>Dimitra Angelidou</b></sub>
                </a>
            </td>
            <td align="center" valign="top" width="25%">
                <a href="https://github.com/Kostaga">
                    <img src="https://avatars.githubusercontent.com/u/59094550?v=4?s=100" width="100px;" alt="Konstantinos Agathopoulos"/>
                    <br />
                    <sub><b>Konstantinos Agathopoulos</b></sub>
                </a>
            </td>
            </tr>
            <tr>
            <td align="center" valign="top" width="25%">
                <a href="https://github.com/VirtualVirtuosoV1">
                    <img src="https://avatars.githubusercontent.com/u/110724304?v=4?s=100" width="100px;" alt="Michalis Karypidis"/>
                    <br />
                    <sub><b>Michalis Karipidis</b></sub>
                </a>
            </td>
            <td align="center" valign="top" width="25%">
                <a href="https://github.com/itsMyrto">
                    <img src="https://avatars.githubusercontent.com/u/75997814?v=4?s=100" width="100px;" alt="Myrto Gkogkou"/>
                    <br />
                    <sub><b>Myrto Gkogkou</b></sub>
                </a>
            </td>
            <td align="center" valign="top" width="25%">
                <a href="https://github.com/neron-png">
                    <img src="https://avatars.githubusercontent.com/u/18248043?v=4?s=100" width="100px;" alt="Neron Panagiotopoulos"/>
                    <br />
                    <sub><b>Neron Panagiotopoulos</b></sub>
                </a>
            </td>
            </td>
            <td align="center" valign="top" width="25%">
                <a href="https://github.com/VasilisMicha">
                    <img src="https://avatars.githubusercontent.com/u/145148992?v=4?s=100" width="100px;" alt="Vasilis Michaelidis"/>
                    <br />
                    <sub><b>Vasilis Michaelidis</b></sub>
                </a>
            </td>
        </tr>
    </tbody>
</table>

<p float="left">
  <img src="https://cdn.discordapp.com/attachments/1139193885084627024/1229763594665721908/Artboard_1.png?ex=6630dd98&is=661e6898&hm=8bcd18435c60fbefbd67801e7bd9adee38ee67f57c2a7c0cdac453b41011f9c6&" alt="Image 1" style="height:200px; margin-right: 10px;">
  <img src="https://cdn.discordapp.com/attachments/1139193885084627024/1229763595168907284/Artboard_2_1.png?ex=6630dd98&is=661e6898&hm=a4e66e246918cbe071d1695e912c8b7174669aa0d073afb5c9e92e4506bd1af1&" alt="Image 2" style="height:200px; margin-right: 10px;">
  <img src="https://cdn.discordapp.com/attachments/1139193885084627024/1229763595693461514/Caffeteria.png?ex=6630dd99&is=661e6899&hm=9271336b3b03fc1845a8e953e1bb4a3dcb3af2a10780a988d01ef6236d2377ed&" alt="Image 2" style="height:200px; margin-right: 10px;">
  <img src="https://cdn.discordapp.com/attachments/1139193885084627024/1229763592816169021/grades.png?ex=6630dd98&is=661e6898&hm=c1de10a0d6957430cae6e18cb03c18f16fe44d33b57f5d67dd73707d53346ba9&" alt="Image 2" style="height:200px; margin-right: 10px;">
  <img src="https://cdn.discordapp.com/attachments/1139193885084627024/1229763593373876285/Notifications.png?ex=6630dd98&is=661e6898&hm=2b0f9bed01928b4ead1050a51a970cd038c8df29cd9306d71d3749b082b3edb5&" alt="Image 2" style="height:200px; margin-right: 10px;">
  <img src="https://cdn.discordapp.com/attachments/1139193885084627024/1229763594103554138/schedule.png?ex=6630dd98&is=661e6898&hm=32aaeced0ca09435a5f6f3f28382ca3d825448e8ceb1a7e01d2c8362d6342571&" alt="Image 2" style="height:200px; margin-right: 10px;">
</p>

# Authentication and Data Flow explanation

https://www.figma.com/board/i76ryDp8wAZVaX7OdCjq1q/Data-diagrams?node-id=0-1&t=x56mKbirsAnNkQtv-1


## Setting up the project for local development
- Clone the project
```bash
$ git clone https://github.com/acmauth/StudentCompanion.git
```

`cd StudentCompanion` to enter the project directory

- Install the dependencies with node 18
```bash
$ npm install
```

## Running the project in preview mode
```bash
$ npm run dev -- --open
```

## Building the android project
```bash
$ npm run build
$ npx cap sync
```
