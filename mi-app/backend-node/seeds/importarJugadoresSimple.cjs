// ============================================================
// SCRIPT NODE.JS - IMPORTAR JUGADORES MUNDIAL 2026
// Uso: node importarJugadoresSimple.js
// Modelo simplificado: solo nombre y equipo
// ============================================================

const mongoose = require('mongoose');
require('dotenv').config();                    
const Jugador = require('../models/Jugador');
const Equipo = require('../models/Equipo');



const importarJugadores = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');
    // Borrar todos los jugadores existentes antes de importar
await Jugador.deleteMany({});
console.log('🗑️  Jugadores anteriores eliminados');

    // Datos de jugadores por equipo
    const equiposJugadores = [
      {
        equipo: "República Checa",
        jugadores: [
          "Matej Kovar", "Jindrich Stanek", "Lukas Hornicek", "Vladimir Coufal",
          "Tomas Holes", "Ladislav Krejcki", "David Zima", "Jaroslav Zeleny",
          "David Jurasek", "David Doudera", "Robin Hranec", "Stepan Chaloupek",
          "Tomas Soucek", "Vladimir Darida", "Lukas Provod", "Michal Sadilek",
          "Pavel Sulc", "Lukas Serv", "Hugo Sochurek", "Alexandr Sojka",
          "Denis Visinsky", "Patrik Schick", "Adam Hlozek", "Jan Kuchta",
          "Mojmir Chytil", "Tomas Chory"
        ]
      },
      {
        equipo: "México",
        jugadores: [
          "Guillermo Ochoa", "Raul Rangel", "Carlos Acevedo", "Jesus Gallardo",
          "Cesar Montes", "Jorge Sanchez", "Johan Vasquez", "Israel Reyes",
          "Mateo Chavez", "Edson Alvarez", "Orbelin Pineda", "Luis Romo",
          "Roberto Alvarado", "Luis Chavez", "Eric Lira", "Gilberto Mora",
          "Brian Gutierrez", "Obed Vargas", "Alvaro Fidalgo", "Raul Jimenez",
          "Alexis Vega", "Santiago Gimenez", "Cesar Huerta", "Julian Quinones",
          "Guillermo Martinez", "Armando Gonzalez"
        ]
      },
      {
        equipo: "Sudáfrica",
        jugadores: [
          "Ronwen Williams", "Ricardo Goss", "Sipho Chaine", "Aubrey Modiba",
          "Khuliso Mudau", "Nkosinathi Sibisi", "Mbekezeli Mbokazi", "Ime Okon",
          "Samukele Kabini", "Khulumani Ndamane", "Thabang Matuludi", "Kamogelo Sebelebele",
          "Bradley Cross", "Olwethu Makhanya", "Teboho Mokoena", "Sphephelo Sithole",
          "Thalente Mbatha", "Jayden Adams", "Themba Zwane", "Lyle Foster",
          "Evidence Makgopa", "Oswin Appollis", "Iqraam Rayners", "Relebohile Mofokeng",
          "Thapelo Maseko", "Tshepang Moremi"
        ]
      },
      {
        equipo: "Corea del Sur",
        jugadores: [
          "Kim Seung-Gyu", "Jo Hyeon-woo", "Song Bum-keun", "Kim Min-jae",
          "Kim Moon-hwan", "Seol Young-woo", "Cho Yu-min", "Lee Tae-seok",
          "Park Jin-seob", "Kim Tae-hyeon", "Lee Han-beom", "Jens Castrop",
          "Lee Ki-hyuk", "Lee Jae-sung", "Hwang Hee-chan", "Hwang In-beom",
          "Lee Kang-in", "Paik Seung-ho", "Kim Jin-gyu", "Lee Dong-gyeong",
          "Bae Jun-ho", "Eom Ji-Sung", "Yang Hyun-jun", "Son Heung-min",
          "Cho Gue-sung", "Oh Hyeon-gyu"
        ]
      },
      {
        equipo: "Bosnia y Herzegovina",
        jugadores: [
          "Nikola Vasilj", "Martin Zlomislic", "Osman Hadzikic", "Sead Kolasinac",
          "Dennis Hadzikadunic", "Amar Dedic", "Nikola Katic", "Tarik Muharemovic",
          "Nihad Mujakic", "Stjepan Radeljic", "Nidal Celik", "Amir Hadziahmetovic",
          "Benjamin Tahirovic", "Armin Gigovic", "Dzenis Burnic", "Ivan Basic",
          "Esmir Bajraktarevic", "Amar Memic", "Ivan Sunjic", "Kerim Alajbegovic",
          "Ermin Mahmic", "Edin Dzeko", "Ermedin Demirovic", "Samed Bazdar",
          "Haris Tabakovic", "Jovo Lukic"
        ]
      },
      {
        equipo: "Canadá",
        jugadores: [
          "Dayne St Clair", "Maxime Crepeau", "Owen Goodman", "Alistair Johnston",
          "Luc de Fougerolles", "Alfie Jones", "Joel Waterman", "Derek Cornelius",
          "Moise Bombito", "Alphonso Davies", "Richie Laryea", "Niko Sigur",
          "Mathieu Choiniere", "Stephen Eustaquio", "Ismael Kone", "Liam Millar",
          "Jacob Schaffelburg", "Tajon Buchanan", "Ali Ahmed", "Jonathan Osorio",
          "Nathan Saliba", "Cyle Larin", "Jonathan David", "Tani Oluwaseyi",
          "Promise David", "Marcelo Flores"
        ]
      },
      {
        equipo: "Suiza",
        jugadores: [
          "Marvin Keller", "Gregor Kobel", "Yvon Mvogo", "Manuel Akanji",
          "Aurele Amenda", "Eray Comert", "Nico Elvedi", "Luca Jaquez",
          "Miro Muheim", "Ricardo Rodriguez", "Silvan Widmer", "Michel Aebischer",
          "Christian Fassnacht", "Remo Freuler", "Ardon Jashari", "Johan Manzambi",
          "Fabian Rieder", "Djibril Sow", "Ruben Vargas", "Granit Xhaka",
          "Denis Zakaria", "Zeki Amdouni", "Breel Embolo", "Cedric Itten",
          "Dan Ndoye", "Noah Okafor"
        ]
      },
      {
        equipo: "Brasil",
        jugadores: [
          "Alisson", "Ederson", "Weverton", "Marquinhos",
          "Danilo Luiz", "Alex Sandro", "Gabriel Magalhaes", "Bremer",
          "Wesley", "Roger Ibanez", "Douglas Santos", "Leo Pereira",
          "Casemiro", "Lucas Paqueta", "Bruno Guimaraes", "Fabinho",
          "Danilo Santos", "Neymar", "Vinicius Jr", "Raphinha",
          "Gabriel Martinelli", "Matheus Cunha", "Endrick", "Luiz Henrique",
          "Igor Thiago", "Rayan"
        ]
      },
      {
        equipo: "Haití",
        jugadores: [
          "Johny Placide", "Alexandre Pierre", "Josue Duverger", "Ricardo Ade",
          "Carlens Arcus", "Martin Experience", "Jean-Kevin Duverne", "Duke Lacroix",
          "Wilguens Paugain", "Hannes Delcroix", "Keeto Thermoncy", "Leverton Pierre",
          "Danley Jean Jacques", "Carl Sainte", "Jean-Ricner Bellegarde", "Woodensky Pierre",
          "Dominique Simon", "Duckens Nazon", "Frantzdy Pierrot", "Derrick Etienne Jr",
          "Louicius Deedson", "Ruben Providence", "Josue Casimir", "Yassin Fortune",
          "Wilson Isidor", "Lenny Joseph"
        ]
      },
      {
        equipo: "Marruecos",
        jugadores: [
          "Yassine Bounou", "Munir Mohamedi", "Ahmed Reda Tagnaouti", "Achraf Hakimi",
          "Nayef Aguerd", "Noussair Mazraoui", "Youssef Belammari", "Anass Salah-Eddine",
          "Chadi Riad", "Issa Diop", "Zakaria El Ouahdi", "Redouane Halhal",
          "Sofyan Amrabat", "Azzedine Ounahi", "Bilal El Khannouss", "Ismael Saibari",
          "Neil El Aynaoui", "Samir El Mourabet", "Ayyoub Bouaddi", "Ayoub El Kaabi",
          "Soufiane Rahimi", "Brahim Diaz", "Abde Ezzalzouli", "Chemsdine Talbi",
          "Gessime Yassine", "Ayoube Amaimouni"
        ]
      },
      {
        equipo: "Escocia",
        jugadores: [
          "Angus Gunn", "Craig Gordon", "Liam Kelly", "Andy Robertson",
          "Kieran Tierney", "Anthony Ralston", "John Souttar", "Scott McKenna",
          "Jack Hendry", "Aaron Hickey", "Nathan Patterson", "Grant Hanley",
          "Dominic Hyam", "Scott McTominay", "Tyler Fletcher", "John McGinn",
          "Kenny McLean", "Lewis Ferguson", "Ryan Christie", "Findlay Curtis",
          "Ben Gannon-Doak", "Lawrence Shankland", "George Hirst", "Che Adams",
          "Ross Stewart", "Lyndon Dykes"
        ]
      },
      {
        equipo: "Australia",
        jugadores: [
          "Mathew Ryan", "Paul Izzo", "Patrick Beach", "Aziz Behich",
          "Milos Degenek", "Harry Souttar", "Jordan Bos", "Cameron Burgess",
          "Jason Geria", "Alessandro Circati", "Kai Trewin", "Jacob Italiano",
          "Lucas Herrington", "Jackson Irvine", "Ajdin Hrustic", "Connor Metcalfe",
          "Aiden O'Neill", "Paul Okon-Engstler", "Cammy Devlin", "Mathew Leckie",
          "Awer Mabil", "Nestory Irankunda", "Mohamed Toure", "Nishan Velupillay",
          "Cristian Volpato", "Tete Yengi"
        ]
      },
      {
        equipo: "Estados Unidos",
        jugadores: [
          "Matt Turner", "Chris Brady", "Matt Freese", "Sergino Dest",
          "Chris Richards", "Antonee Robinson", "Auston Trusty", "Miles Robinson",
          "Tim Ream", "Alex Freeman", "Mark McKenzie", "Joe Scally",
          "Tyler Adams", "Weston McKennie", "Christian Pulisic", "Sebastian Berhalter",
          "Cristian Roldan", "Malik Tillman", "Gio Reyna", "Ricardo Pepi",
          "Brenden Aaronson", "Max Arfsten", "Haji Wright", "Folarin Balogun",
          "Tim Weah", "Alex Zendejas"
        ]
      },
      {
        equipo: "Curazao",
        jugadores: [
          "Eloy Room", "Trevor Doornbusch", "Tyrick Bodak", "Jurien Gaari",
          "Roshon van Eijma", "Sherel Floranus", "Joshua Brenet", "Shurandy Sambo",
          "Armando Obispo", "Riechedly Bazoer", "Deveron Fonville", "Leandro Bacuna",
          "Juninho Bacuna", "Godfried Roemeratoe", "Kevin Felida", "Livano Comenencia",
          "Ar'jany Martha", "Tyrese Noslin", "Kenji Gorre", "Brandley Kuwas",
          "Gervane Kastaneer", "Jeremy Antonisse", "Jearl Margaritha", "Jurgen Locadia",
          "Sontje Hansen", "Tahith Chong"
        ]
      },
      {
        equipo: "Ecuador",
        jugadores: [
          "Hernan Galindez", "Moises Ramirez", "Gonzalo Valle", "Felix Torres",
          "Piero Hincapie", "Joel Ordonez", "Willian Pacho", "Pervis Estupinan",
          "Angelo Preciado", "Jackson Porozo", "Jordy Alcivar", "Denil Castillo",
          "John Yeboah", "Kendry Paez", "Alan Minda", "Pedro Vite",
          "Gonzalo Plata", "Alan Franco", "Moises Caicedo", "Yaimar Medina",
          "Kevin Rodriguez", "Enner Valencia", "Anthony Valencia", "Jordy Caicedo",
          "Nilson Angulo", "Jeremy Arevalo"
        ]
      },
      {
        equipo: "Alemania",
        jugadores: [
          "Manuel Neuer", "Oliver Baumann", "Alexander Nubel", "Antonio Rudiger",
          "Jonathan Tah", "Nico Schlotterbeck", "Nathaniel Brown", "David Raum",
          "Malick Thiaw", "Waldemar Anton", "Pascal Gross", "Joshua Kimmich",
          "Leon Goretzka", "Lennart Karl", "Jamal Musiala", "Florian Wirtz",
          "Jamie Leweling", "Aleksandar Pavlovic", "Maximilian Beier", "Nadiem Amiri",
          "Leroy Sane", "Angelo Stiller", "Felix Nmecha", "Kai Havertz",
          "Denis Undav", "Nick Woltemeade"
        ]
      },
      {
        equipo: "Costa de Marfil",
        jugadores: [
          "Yahia Fofana", "Alban Lafont", "Mohamed Kone", "Ghislain Konan",
          "Odilon Kossounou", "Wilfried Singo", "Evan Ndicka", "Emmanuel Agbadou",
          "Guela Doue", "Ousmane Diomande", "Clement Akpa", "Franck Kessie",
          "Jean Michael Seri", "Ibrahim Sangare", "Seko Fofana", "Christ Inao Oulai",
          "Parfait Guiagon", "Nicolas Pepe", "Oumar Diakite", "Simon Adingra",
          "Evann Guessand", "Amad Diallo", "Yan Diomande", "Bazoumana Toure",
          "Elye Wahi", "Ange Yoan-Bonny"
        ]
      },
      {
        equipo: "Japón",
        jugadores: [
          "Zion Suzuki", "Keisuke Osako", "Tomoki Hayakawa", "Yuto Nagatomo",
          "Takehiro Tomiyasu", "Ko Itakura", "Shogo Taniguchi", "Hiroki Ito",
          "Yukinari Sugawara", "Ayumu Seko", "Tsuyoshi Watanabe", "Junnosuke Suzuki",
          "Wataru Endo", "Junya Ito", "Ritsu Doan", "Daichi Kamada",
          "Takefusa Kubo", "Ao Tanaka", "Keito Nakamura", "Kaishu Sano",
          "Ayase Ueda", "Daizen Maeda", "Koki Ogawa", "Yuito Suzuki",
          "Keisuke Goto", "Kento Shiogai"
        ]
      },
      {
        equipo: "Países Bajos",
        jugadores: [
          "Mark Flekken", "Robin Roefs", "Bart Verbruggen", "Nathan Ake",
          "Denzel Dumfries", "Jorrel Hato", "Jurrien Timber", "Jan Paul van Hecke",
          "Virgil van Dijk", "Micky van de Ven", "Mats Wieffer", "Ryan Gravenberch",
          "Frenkie de Jong", "Teun Koopmeijners", "Tijjani Reijnders", "Maarten de Roon",
          "Guus Til", "Quinten Timber", "Brian Brobbey", "Memphis Depay",
          "Cody Gakpo", "Justin Kluivert", "Noa Lang", "Donyell Malen",
          "Crysencio Summerville", "Wout Weghorst"
        ]
      },
      {
        equipo: "Suecia",
        jugadores: [
          "Kristoffer Nordfeldt", "Viktor Johansson", "Jacob Widell Zetterstrom", "Victor Lindelof",
          "Isak Hien", "Gabriel Gudmundsson", "Carl Starfelt", "Emil Holm",
          "Hjalmar Ekdal", "Daniel Svensson", "Gustaf Lagerbielke", "Eric Smith",
          "Elliot Stroud", "Mattias Svanberg", "Jesper Karlstrom", "Yasin Ayari",
          "Lucas Bergvall", "Besfort Zeneli", "Alexander Isak", "Viktor Gyokeres",
          "Ken Sema", "Anthony Elanga", "Benjamin Nygren", "Alexander Bernhardsson",
          "Gustaf Nilsson", "Taha Ali"
        ]
      },
      {
        equipo: "Túnez",
        jugadores: [
          "Aymen Dahmen", "Sabri Ben Hessen", "Mouhib Chamakh", "Montassar Talbi",
          "Dylan Bronn", "Ali Abdi", "Yan Valery", "Mohamed Amine Ben Hamida",
          "Moutaz Neffati", "Omar Rekik", "Adem Arous", "Raed Chikhaoui",
          "Ellyes Shkiri", "Hannibal Mejbri", "Anis Ben Slimane", "Mortadha Ben Ouanes",
          "Ismael Gharbi", "Hadj Mahmoud", "Rani Khedira", "Elias Achouri",
          "Firas Chaouat", "Hazem Mastouri", "Elias Saad", "Sebastian Tounekti",
          "Khalil Ayari", "Rayan Elloumi"
        ]
      },
      {
        equipo: "Bélgica",
        jugadores: [
          "Thibaut Courtois", "Senne Lammens", "Mike Penders", "Thomas Meunier",
          "Timothy Castagne", "Arthur Theate", "Zeno Debast", "Maxim De Cuyper",
          "Brandon Mechele", "Koni De Winter", "Joaquin Seys", "Nathan Ngoy",
          "Axel Witsel", "Kevin De Bruyne", "Youri Tielemans", "Hans Vanaken",
          "Amadou Onana", "Nicolas Raskin", "Romelu Lukaku", "Leandro Trossard",
          "Jeremy Doku", "Dodi Lukebakio", "Charles De Ketelaere", "Alexis Saelemakers",
          "Diego Moreira", "Matias Fernandez-Pardo"
        ]
      },
      {
        equipo: "Egipto",
        jugadores: [
          "Mohamed El Shenawy", "Mostafa Shobeir", "Mohamed Alaa", "El Mahdy Soliman",
          "Hamdy Fathy", "Ramy Rabia", "Mohamed Hany", "Ahmed Fatouh",
          "Mohamed Abdelmonem", "Yasser Ibrahim", "Hossam Abdelmaguid", "Karim Hafez",
          "Tarek Alaa", "Marwan Attia", "Emam Ashour", "Mohanad Lasheen",
          "Mahmoud Saber", "Nabil Emad", "Mostafa Ziko", "Mohamed Salah",
          "Trezeguet", "Zizo", "Omar Marmoush", "Ibrahim Adel",
          "Haissem Hassan", "Hamza Abdelkarim"
        ]
      },
      {
        equipo: "Nueva Zelanda",
        jugadores: [
          "Max Crocombe", "Alex Paulsen", "Michael Woud", "Tim Payne",
          "Francis de Vries", "Tyler Bindon", "Michael Boxall", "Liberato Cacace",
          "Nando Pijnaker", "Finn Surman", "Callan Elliot", "Tommy Smith",
          "Joe Bell", "Matthew Garbett", "Marko Stamenic", "Sarpreet Singh",
          "Elijah Just", "Alex Rufer", "Ben Old", "Callum McCowatt",
          "Ryan Thomas", "Lachlan Bayliss", "Chris Wood", "Kosta Barbarouses",
          "Ben Waine", "Jesse Randall"
        ]
      },
      {
        equipo: "Cabo Verde",
        jugadores: [
          "Vozinho", "Marcio Rosa", "CJ dos Santos", "Stopira",
          "Roberto Lopes", "Joao Paulo Fernandes", "Diney", "Logan Costa",
          "Steven Moreira", "Wagner Pina", "Sidny Lopes Cabral", "Kelvin Pires",
          "Jamiro Monteiro", "Kevin Pina", "Deroy Duarte", "Telmo Arcanjo",
          "Laros Duarte", "Yannick Semedo", "Ryan Mendes", "Garry Rodrigues",
          "Willy Semedo", "Jovane Cabral", "Gilson Benchimol", "Dailon Livramento",
          "Helio Varela", "Nuno da Costa"
        ]
      },
      {
        equipo: "Arabia Saudita",
        jugadores: [
          "Mohammed Al-Owais", "Nawaf Al-Aqidi", "Ahmed Al-Kassar", "Saud Abdulhamid",
          "Hassan Al-Tambakti", "Abdulelah Al-Amri", "Nawaf Boushal", "Ali Lajami",
          "Ali Majrashi", "Hassan Kadesh", "Moteb Al-Harbi", "Jehad Thakri",
          "Mohammed Abu Al-Shamat", "Salem Al-Dawsari", "Abdullah Al-Khaibari", "Mohamed Kanno",
          "Nasser Al-Dawsari", "Musab Al-Juwayr", "Ayman Yahya", "Ziyad Al-Johani",
          "Sultan Mandesh", "Alaa Al-Hejji", "Firas Al-Buraikan", "Saleh Al-Shehri",
          "Abdullah Al-Hamdan", "Khalid Al-Ghannam"
        ]
      },
      {
        equipo: "España",
        jugadores: [
          "Unai Simon", "David Raya", "Joan Garcia", "Aymeric Laporte",
          "Marc Cucurella", "Marcos Llorente", "Eric Garcia", "Pedro Porro",
          "Alex Grimaldo", "Pau Cubarsi", "Marc Pubill", "Rodri",
          "Fabian Ruiz", "Mikel Merino", "Pedri", "Gavi",
          "Martin Zubimendi", "Alex Baena", "Ferran Torres", "Mikel Oyarzabal",
          "Dani Olmo", "Nico Williams", "Lamine Yamal", "Yeremy Pino",
          "Borja Iglesias", "Victor Munoz"
        ]
      },
      {
        equipo: "Uruguay",
        jugadores: [
          "Fernando Muslera", "Sergio Rochet", "Santiago Mele", "Jose Maria Gimenez",
          "Matias Vina", "Mathias Olivera", "Guillermo Varela", "Ronald Araujo",
          "Sebastian Caceres", "Joaquin Piquerez", "Santiago Bueno", "Rodrigo Bentancur",
          "Federico Valverde", "Giorgian de Arrascaeta", "Facundo Pellistri", "Manuel Ugarte",
          "Nicolas de la Cruz", "Brian Rodriguez", "Maximiliano Araujo", "Agustin Canobbio",
          "Emiliano Martinez", "Rodrigo Zalazar", "Juan Manuel Sanabria", "Darwin Nunez",
          "Federico Vinas", "Rodrigo Aguirre"
        ]
      },
      {
        equipo: "Francia",
        jugadores: [
          "Mike Maignan", "Brice Samba", "Robin Risser", "Lucas Digne",
          "Jules Kounde", "Theo Hernandez", "Lucas Hernandez", "Dayot Upamecano",
          "William Saliba", "Ibrahima Konate", "Malo Gusto", "Maxence Lacroix",
          "N'Golo Kante", "Adrien Rabiot", "Aurelien Tchouameni", "Manu Kone",
          "Warren Zaire-Emery", "Kylian Mbappe", "Ousmane Dembele", "Marcus Thuram",
          "Bradley Barcola", "Michael Olise", "Maghnes Akliouche", "Desire Doue",
          "Rayan Cherki", "Jean-Philippe Mateta"
        ]
      },
      {
        equipo: "Noruega",
        jugadores: [
          "Orjan Nyland", "Egil Selvik", "Sander Tangvik", "Kristoffer Ajer",
          "Julian Ryerson", "Leo Ostigard", "Marcus Holmgren Pedersen", "David Moller Wolfe",
          "Fredrik Andre Bjorkan", "Torbjorn Heggem", "Sondre Langas", "Henrik Falchener",
          "Martin Odegaard", "Sander Berge", "Patrick Berg", "Kristian Thorstvedt",
          "Morten Thorsby", "Antonio Nusa", "Fredrik Aursnes", "Oscar Bobb",
          "Jens Petter Hauge", "Andreas Schjelderup", "Thelo Aasgaard", "Erling Haaland",
          "Alexander Sorloth", "Jorgen Strand Larsen"
        ]
      },
      {
        equipo: "Senegal",
        jugadores: [
          "Edouard Mendy", "Mory Diaw", "Yehvann Diouf", "Kalidou Koulibaly",
          "Krepin Diatta", "Moussa Niakhate", "Ismail Jakobs", "Abdoulaye Seck",
          "El Hadj Malick Diouf", "Antoine Mendy", "Mamadou Sarr", "Ilay Camara",
          "Moustapha Mbow", "Idrissa Gueye", "Pape Gueye", "Pape Matar Sarr",
          "Pathe Siss", "Lamine Camara", "Habib Diarra", "Bara Sapoko Ndiaye",
          "Sadio Mane", "Ismaila Sarr", "Iliman Ndiaye", "Nicolas Jackson",
          "Bamba Dieng", "Cherif Ndiaye", "Ibrahim Mbaye", "Assane Diao"
        ]
      },
      {
        equipo: "Argelia",
        jugadores: [
          "Luca Zidane", "Oussama Benbot", "Melvin Mastil", "Aissa Mandi",
          "Ramy Bensebaini", "Mohamed Amine Tougai", "Rayan Ait-Nouri", "Jaouen Hadjam",
          "Rafik Belghali", "Zineddine Belaid", "Achref Abada", "Samir Chergui",
          "Nabil Bentaleb", "Ramiz Zerrouki", "Hicham Boudaoui", "Fares Chaibi",
          "Houssem Aouar", "Ibrahim Maza", "Yacine Titraoui", "Riyad Mahrez",
          "Mohamed Amoura", "Amine Gouiri", "Anis Hadj Moussa", "Adil Boulbina",
          "Nadhir Benbouali", "Fares Ghedjemis"
        ]
      },
      {
        equipo: "Argentina",
        jugadores: [
          "Emiliano Martinez", "Geronimo Rulli", "Juan Musso", "Nicolas Otamendi",
          "Nicolas Tagliafico", "Nahuel Molina", "Cristian Romero", "Gonzalo Montiel",
          "Lisandro Martinez", "Leonardo Balerdi", "Facundo Medina", "Rodrigo De Paul",
          "Leandro Paredes", "Giovani Lo Celso", "Alexis Mac Allister", "Enzo Fernandez",
          "Exequiel Palacios", "Valentin Barco", "Lionel Messi", "Julian Alvarez",
          "Lautaro Martinez", "Nicolas Gonzalez", "Thiago Almada", "Giuliano Simeone",
          "Nico Paz", "Jose Manuel Lopez"
        ]
      },
      {
        equipo: "Austria",
        jugadores: [
          "Alexander Schlager", "Florian Wiegele", "Patrick Pentz", "David Affengruber",
          "Kevin Danso", "Stefan Posch", "David Alaba", "Philipp Lienhart",
          "Phillipp Mwene", "Alexander Prass", "Marco Friedl", "Michael Svoboda",
          "Xaver Schlager", "Nicolas Seiwald", "Marcel Sabitzer", "Florian Grillitsch",
          "Carney Chukwuemeka", "Romano Schmid", "Christoph Baumgartner", "Konrad Laimer",
          "Patrick Wimmer", "Paul Wanner", "Alessandro Schopf", "Marko Arnautovic",
          "Michael Gregoritsch", "Sasa Kalajdzic"
        ]
      },
      {
        equipo: "Colombia",
        jugadores: [
          "David Ospina", "Camilo Vargas", "Alvaro Montero", "Davinson Sanchez",
          "Santiago Arias", "Yerry Mina", "Daniel Munoz", "Johan Mojica",
          "Jhon Lucumi", "Deiver Machado", "Willer Ditta", "James Rodriguez",
          "Jefferson Lerma", "Juan Fernando Quintero", "Jhon Arias", "Richard Rios",
          "Kevin Castano", "Jorge Carrastal", "Jaminton Campaz", "Juan Portilla",
          "Gustavo Puerta", "Luis Diaz", "Jhon Cordoba", "Luis Suarez",
          "Cucho Hernandez", "Andres Gomez"
        ]
      },
      {
        equipo: "Rep. Democrática del Congo",
        jugadores: [
          "Lionel Mpasi", "Timothy Fayulu", "Matthieu Epolo", "Chancel Mbemba",
          "Arthur Masuaku", "Gedeon Kalulu", "Joris Kayembe", "Dylan Batubinsika",
          "Axel Tuanzebe", "Aaron Wan-Bissaka", "Rocky Bushiri", "Steve Kapuadi",
          "Meschak Elia", "Samuel Moutoussamy", "Edo Kayembe", "Charles Pickel",
          "Gael Kakuta", "Noah Sadiki", "Nathanael Mbuku", "Ngal'ayel Mukau",
          "Brian Cipenga", "Cedric Bakambu", "Theo Bongonba", "Fiston Mayele",
          "Yoane Wissa", "Simon Banza"
        ]
      },
      {
        equipo: "Portugal",
        jugadores: [
          "Diogo Costa", "Jose Sa", "Rui Silva", "Joao Cancelo",
          "Diogo Dalot", "Ruben Dias", "Goncalo Inacio", "Nuno Mendes",
          "Renato Veiga", "Matheus Nunes", "Nelson Semedo", "Tomas Araujo",
          "Bruno Fernandes", "Joao Neves", "Bernardo Silva", "Vitinha",
          "Ruben Neves", "Samu Costa", "Cristiano Ronaldo", "Rafael Leao",
          "Pedro Neto", "Francisco Conceicao", "Joao Felix", "Goncalo Guedes",
          "Goncalo Ramos", "Francisco Trincao"
        ]
      },
      {
        equipo: "Croacia",
        jugadores: [
          "Dominik Livakovic", "Dominik Kotarski", "Ivor Pandur", "Josko Gvardiol",
          "Duje Caleta-Car", "Josip Stanisic", "Marin Pongracic", "Martin Erlic",
          "Luka Vuskovic", "Luka Modric", "Mateo Kovacic", "Mario Pasalic",
          "Nikola Vlasic", "Luka Sucic", "Martin Baturina", "Kristijan Jakic",
          "Petar Sucic", "Nikola Moro", "Toni Fruk", "Ivan Perisic",
          "Andrej Kramaric", "Ante Budimir", "Marco Pasalic", "Petar Musa",
          "Igor Matanovic"
        ]
      },
      {
        equipo: "Inglaterra",
        jugadores: [
          "Jordan Pickford", "Dean Henderson", "James Trafford", "Dan Burn",
          "Marc Guehi", "Reece James", "Ezri Konsa", "Tino Livramento",
          "Nico O'Reilly", "Jarrell Quansah", "Djed Spence", "John Stones",
          "Elliot Anderson", "Jude Bellingham", "Eberechi Eze", "Jordan Henderson",
          "Kobbie Mainoo", "Declan Rice", "Morgan Rogers", "Harry Kane",
          "Anthony Gordon", "Noni Madueke", "Marcus Rashford", "Bukayo Saka",
          "Ivan Toney", "Ollie Watkins"
        ]
      },
      {
        equipo: "Panamá",
        jugadores: [
          "Orlando Mosquera", "Luis Mejia", "Cesar Samudio", "Cesar Blackman",
          "Jorge Gutierrez", "Amir Murillo", "Fidel Escobar", "Andres Andrade",
          "Edgardo Farina", "Jose Cordoba", "Eric Davis", "Jiovany Ramos",
          "Roderick Miller", "Anibal Godoy", "Carlos Harvey", "Cristian Martinez",
          "Jose Luis Rodriguez", "Cesar Yanis", "Yoel Barcenas", "Azarias Londono",
          "Adalberto Carrasquilla", "Alberto Quintero", "Ismael Diaz", "Cecilio Waterman",
          "Jose Fajardo", "Tomas Rodriguez"
        ]
      },
      {
        equipo: "Catar",
        jugadores: [
            "Meshaal Barsham","Salah Zakaria","Mahmoud Abunada",
            "Pedro Miguel","Boualem Khoukhi","Sultan Al-Brake","Al-Hashmi Al-Hussain",
            "Ayoub Al-Alawi","Issa Laye","Lucas Mendes","Mohammed Waad","Niall Mason",
            "Ahmed Fathi","Jassim Gaber","Assim Madibo","Karim Boudiaf",
            "Abdulaziz Hatem","Hassan Al-Haydos","Mohamed Al-Mannai",
            "Akram Afif","Almoez Ali","Edmilson Junior",
            "Yusuf Abdurisag","Mohammed Muntari","Ahmed Alaaeldin","Homam Ahmed"
        ]
      },
      {
        equipo: "Paraguay",
        jugadores: [
          "Orlando Gill", "Roberto Fernández", "Gastón Olveira",
          "Juan Cáceres", "Gustavo Gómez", "Junior Alonso", "José Canale", "Omar Alderete",
          "Alexandro Maidana", "Fabián Balbuena",
          "Diego Gómez", "Mauricio Magalhaes", "Damián Bobadilla", "Braian Ojeda",
          "Andrés Cubas", "Matías Galarza", "Alejandro Romero", "Gustavo Caballero", "Ramón Sosa",
          "Alex Arce", "Gabriel Ávalos", "Isidro Pitta", "Miguel Almirón",
          "Julio Enciso", "Antonio Sanabria"
        ]
      },
      {
        equipo: "Turquía",
        jugadores: [ 
          "Ugurcan Cakir","Altay Bayindir","Mert Gunok","Ferdi Kadioglu",
          "Merih Demiral","Zeki Celik","Ozan Kabak","Mert Muldur",
          "Abdulkerim Bardakci","Eren Elmali","Caglar Soyuncu",
          "Samet Akaydin","Arda Guler","Hakan Calhanoglu",
          "Orkun Kokcu","Ismail Yuksek","Salih Ozcan","Kaan Ayhan","Can Uzun",
          "Kenan Yildiz","Kerem Akturkoglu","Baris Alper Yilmaz","Yunus Akgun",
          "Oguz Aydin","Deniz Gul","Irfan Can Kahveci"
        ]
      },
      {
        equipo: "Irán",
        jugadores: [
          "Alireza Beiranvand","Seyed Hossein Hosseini","Payam Niazmand",
          "Danial Eiri","Ehsan Hajsafi","Saleh Hardani","Hossein Kanaani",
          "Shoja Khalilzadeh","Milad Mohammadi","Ali Nemati","Ramin Rezaeian",
          "Rouzbeh Cheshmi","Saeid Ezatolahi","Mehdi Ghaedi","Saman Ghoddos",
          "Mohammad Ghorbani","Alireza Jahanbakhsh","Mohammad Mohebi",
          "Amir Mohammad Razzaghinia","Mehdi Torabi","Aria Yousefi",
          "Ali Alipour","Dennis Dargahi","Amirhossein Hosseinzadeh",
          "Mehdi Taremi","Shahriar Moghanlou"
        ]
      },
      {
        equipo: "Irak",
        jugadores: [
            "Jalal Hassan","Ahmed Basil","Fahad Talib",
            "Rebin Sulaka","Hussein Ali","Zaid Tahseen","Akam Hashim",
            "Manaf Younis","Mustafa Saadoon","Ahmed Yahya","Merchas Doski",
            "Frans Putros","Ali Jasim","Zidane Iqbal","Amir Al-Ammari",
            "Kevin Yakob","Ibrahim Bayesh","Aimar Sher","Marko Farji",
            "Youssef Amyn","Ahmed Qasem","Zaid Ismail",
            "Aymen Hussein","Ali Al-Hamadi","Mohanad Ali","Ali Yousef"
        ]
      },
      {
        equipo: "Jordania",
       jugadores: [
            "Yazeed Abu Laila","Noor Bani Ateyah","Abdullah Al-Fakhouri",
            "Mohammad Abu Hasheesh","Abdullah Nasib","Husam Abudahab",
            "Yazan Al-Arab","Mohammad Abualnadi","Saleem Amer Obaid",
            "Saed Al-Rosan","Ehsan Haddad","Anas Badawi","Mohannad Abu Taha",
            "Noor Al-Rawabdeh","Nizar Al-Rashdan","Ibrahim Saadeh",
            "Rajaei Ayed","Amer Jamous","Mohammad Al-Daowud",
            "Mahmoud Al-Mardi","Odeh Al Fakhouri","Mousa Al-Tamari",
            "Mohammad Abu Zraiq","Ali Al-Azaizeh","Ibrahim Sabra","Ali Olwan"
        ]
      },
      {
        equipo: "Uzbekistán",
        jugadores: [
            "Utkir Yusupov","Botirali Ergashev","Abduvohid Nematov",
            "Abdukodir Khusanov","Khojiakbar Alijonov","Farrukh Sayfiev",
            "Rustam Ashurmatov","Umar Eshmurodov","Sherzod Nasrullaev",
            "Abdulla Abdullaev","Avazbek Ulmasaliev","Jakhongir Urozov",
            "Bekhruz Karimov","Akmal Mozgovoy","Otabek Shukurov",
            "Jamshid Iskanderov","Odiljon Hamrobekov","Jaloliddin Masharipov",
            "Oston Urunov","Dostonbek Khamdamov","Aziz Ganiev",
            "Abbosbek Fayzullaev","Sherzod Esanov","Eldor Shomurodov",
            "Igor Sergeev","Azizbek Amonov"
        ]
      },
      {
        equipo: "Ghana",
        jugadores: [
          "Benjamin Asare","Lawrence Ati-Zigi","Joseph Anang",
          "Baba Abdul Rahman","Gideon Mensah","Marvin Senaya","Alidu Seidu",
          "Abdul Mumin","Jerome Opoku","Jonas Adjetey","Derrick Luckassen",
          "Kojo Oppong Peprah","Thomas Partey","Elisha Owusu",
          "Kwasi Sibo","Augustine Boakye","Caleb Yirenkyi",
          "Abdul Fatawu Issahaku","Kamaldeen Sulemana",
          "Jordan Ayew","Antoine Semenyo","Iñaki Williams",
          "Ernest Nuamah","Christopher Bonsu Baah",
          "Brandon Thomas-Asante","Prince Kwabena Adu"
        ]
      }
    ];

   // Procesar cada equipo
    for (const equipoData of equiposJugadores) {
      const nombreEquipo = equipoData.equipo;

      // Buscar o crear el equipo
      let equipo = await Equipo.findOne({ nombre: nombreEquipo });

      if (!equipo) {
        console.log(`⚠️  Equipo "${nombreEquipo}" no encontrado. Creando equipo sin grupo...`);
        equipo = new Equipo({
          nombre: nombreEquipo,
          grupo: null // Necesitarás asignar el grupo manualmente después
        });
        await equipo.save();
        console.log(`✅ Equipo "${nombreEquipo}" creado`);
      }

      // Crear jugadores
      const jugadoresToInsert = equipoData.jugadores.map(nombreJugador => ({
        nombre: nombreJugador,
        equipo: equipo._id
      }));

      await Jugador.insertMany(jugadoresToInsert);
      console.log(`✅ ${jugadoresToInsert.length} jugadores insertados para ${nombreEquipo}`);
    }

    console.log('\n🎉 Importación completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la importación:', error);
    process.exit(1);
  }
};

importarJugadores();