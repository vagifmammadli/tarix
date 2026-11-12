export const sources = {
  georgia: { title: 'Early Neolithic wine of Georgia in the South Caucasus', author: 'Patrick McGovern və b.', year: '2017', detail: 'PNAS 114(48), E10309–E10318; kimyəvi analiz və tarixləndirmə.', url: 'https://doi.org/10.1073/pnas.1714728114' },
  iran: { title: 'Wine Jar · 69-12-15', author: 'Penn Museum', year: 'Kolleksiya qeydi', detail: 'Hajji Firuz, e.ə. 5400–5000; qabın içində şərab və ağac qatranı qalıqları.', url: 'https://collections.penn.museum/collections/object/72388' },
  nature: { title: 'Neolithic resinated wine', author: 'McGovern, Glusker, Exner və Voigt', year: '1996', detail: 'Nature 381, 480–481. Nəşr qeydi; tam mətn abunə tələb edə bilər.', url: 'https://doi.org/10.1038/381480a0' },
  areni: { title: 'Chemical evidence for wine production around 4000 BCE', author: 'Hans Barnard və b.', year: '2011', detail: 'Journal of Archaeological Science 38(5), 977–984; Areni-1 nümunələri.', url: 'https://doi.org/10.1016/j.jas.2010.11.012' },
  roman: { title: 'Àmfora · Museu de Badalona', author: 'Museu de Badalona', year: 'Kolleksiya qeydi', detail: 'Baetulo şəhərinin şərab ixracı üçün amforası. Yerli layihədəki obyekt qeydi.', url: 'https://www.museudebadalona.cat/colleccions/amfora/' },
  helenendorf: { title: 'History · Göygöl', author: 'Göygöl Rayon İcra Hakimiyyəti', year: 'Rəsmi tarix səhifəsi', detail: 'Helenendorf irsi və XIX əsrə aid şərab istehsalı binaları.', url: 'https://goygol-ih.gov.az/en/tarixi.html' },
  germans: { title: 'German heritage in Azerbaijan', author: 'Prezident Kitabxanası', year: 'Tarixi icmal', detail: 'Alman məskənlərində üzümçülük və şərabçılıq; ikinci dərəcəli tarixi icmal.', url: 'https://www.preslib.az/en/historical/page/D9Hl30W' },
  state: { title: 'Üzümçülüyün inkişafına dair Dövlət Proqramı, 2012–2020', author: 'Azərbaycan Respublikası', year: '2011', detail: 'Sahənin inkişafı, tənəzzülü və bərpası haqqında rəsmi sənəd.', url: 'https://www.elibrary.az/docs/SEREN/srn2011_454.pdf' },
};

const pack = 'vineyard-winery-cc0/';
const amphora = 'neck_amphora_wikimedia_cc_by_sa_4.0.stl';
export const environments = [
  { id: 'gallery', title: 'Muzey qalereyası', caption: 'Sərginin əsas marşrutu', file: null },
  { id: 'prehistoric', title: 'İlk yaşayış məskəni', caption: 'Təxəyyülə əsaslanan tarixdən əvvəlki mühit', file: 'scene-prototypes/prehistoric_survivor_settlement_starter_scene.glb', exhibit: 1 },
  { id: 'medieval', title: 'Orta əsr həyəti', caption: 'Ümumi memarlıq nümunəsi · tarixi məkan deyil', file: 'scene-prototypes/medieval_monastery_and_scriptorium_starter_scene.glb', exhibit: 5 },
  { id: 'estate', title: 'Üzüm bağı və zirzəmi', caption: 'Ümumi müasir təsərrüfat · Göygöl rekonstruksiyası deyil', file: pack + 'starter-scene-hillside-estate-open-cellar.glb', exhibit: 8 },
];

export const exhibits = [
  {
    id: 'iz', title: 'Bir qabın yaddaşı', short: 'Dəlili oxumaq', date: 'Başlanğıc', place: 'Arxeoloqun sualı', period: 'Dəlil',
    model: amphora, size: 2.5, position: [-6, 0, 7],
    summary: 'Bir qabın formasına baxaraq içində nə olduğunu bilmək olarmı? Bu sual bizi üzüm toxumundan kimyəvi izlərə, gündəlik əşyadan tarixə aparır.',
    body: 'Üzüm toxumu bitkinin mövcudluğunu göstərir. Şərab istehsalı barədə nəticə çıxarmaq üçün qabdakı kimyəvi qalıqlar, istehsal avadanlığı, tapıntıların bir yerdə olması və etibarlı tarixləndirmə birlikdə araşdırılır.',
    evidence: 'Tədqiqat üsulu', level: 'method', finding: 'Qabın özü, üzvi qalıqlar və arxeoloji kontekst fərqli məlumatlar verir.', limitation: 'Qabın forması təkbaşına şərab istehsalını sübut etmir.',
    sources: ['georgia', 'areni'], question: 'Üzüm toxumu tapsaq, şərab istehsalını da sübut etmiş olarıqmı?', note: 'Obyekti fırladın. Şagirdlərdən forma ilə məzmun arasındakı fərqi izah etmələrini istəyin.',
    credit: 'Noedlh · Wikimedia Commons · CC BY-SA 4.0. Təmsili amfora; arxeoloji skan deyil. Mənbə həndəsəsi dəyişdirilməyib; səhnədə material və ölçü tətbiq edilib.', creditUrl: 'https://commons.wikimedia.org/wiki/File:3D_Model_Neck_Amphora.stl', license: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    id: 'qafqaz', title: 'Torpaqda qalan izlər', short: 'Cənubi Qafqaz', date: 'e.ə. 6000–5800', place: 'Şulaveri və Qadaçrili · Gürcüstan', period: 'Neolit',
    model: environments[1].file, size: 4.1, position: [6, 0, 7], environment: 'prehistoric',
    summary: 'Gürcüstandakı Şulaveri və Qadaçrili məskənlərindən götürülmüş saxsı nümunələrində üzüm şərabına uyğun kimyəvi izlər müəyyən edilib. Bu, Cənubi Qafqazın çox erkən şərab tarixinin mühüm dəlillərindəndir.',
    body: '2017-ci il tədqiqatı kimyəvi analizləri bitki qalıqları, ətraf mühit məlumatları və radiokarbon tarixləri ilə birlikdə qiymətləndirir. Nəticə müasir dövlətlər arasında “ilk yer” yarışı kimi deyil, regional tarix kimi oxunmalıdır.',
    evidence: 'Elmi tədqiqat', level: 'strong', finding: 'Saxsıya hopmuş üzvi birləşmələr; tarixləndirilmiş arxeoloji kontekst.', limitation: 'Bu tapıntılar şərabın yalnız bir yerdə icad edildiyini göstərmir. Gördüyünüz kənd həmin məskənlərin rekonstruksiyası deyil.',
    sources: ['georgia'], question: 'Ən erkən məlum dəlil ilə ilk ixtira eyni şeydirmi?', note: 'Tarix aralığını vurğulayın. “Məlum dəlil” ifadəsini “dəqiq başlanğıc”dan ayırın.',
  },
  {
    id: 'hajji-firuz', title: 'Qabın içindəki kimya', short: 'Hajji Firuz', date: 'e.ə. 5400–5000', place: 'Zaqros dağları · İran', period: 'Neolit',
    model: amphora, size: 2.3, position: [-6, 0, -1],
    summary: 'Hajji Firuzdan tapılmış bir qabın içində şərab və ağac qatranı ilə əlaqələndirilən qalıqlar qeydə alınıb. Penn Museum bu qabı e.ə. 5400–5000-ci illərə aid edir.',
    body: 'Qab Neolit dövrü evinin döşəməsinə yerləşdirilmiş qablar qrupuna daxildir. Bu nümunə göstərir ki, əşyanın nə olduğunu anlamaq üçün onun içindəki izləri də öyrənmək lazımdır.',
    evidence: 'Muzey qeydi və analiz', level: 'strong', finding: 'Qabın içində üzvi qalıqlar; şərab və terebint qatranı ilə uyğunluq.', limitation: 'Sərgidəki amfora yalnız qab formasını izah edir; Penn Museumdakı orijinal tapıntının modeli deyil.',
    sources: ['iran', 'nature'], question: 'Laboratoriya analizi gözlə görünməyən hansı məlumatı üzə çıxarır?', note: 'Bu stansiyanı Qafqaz tapıntıları ilə müqayisə edin: tarixlər və dəlilin növü fərqlidir.',
    credit: 'Noedlh · Wikimedia Commons · CC BY-SA 4.0. Təmsili qab; Hajji Firuz tapıntısının surəti deyil. Mənbə həndəsəsi dəyişdirilməyib; material və ölçü tətbiq edilib.', creditUrl: 'https://commons.wikimedia.org/wiki/File:3D_Model_Neck_Amphora.stl', license: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    id: 'areni', title: 'İzdən istehsala', short: 'Areni-1', date: 'təqr. e.ə. 4000', place: 'Areni-1 mağarası · Ermənistan', period: 'Eneolit',
    model: pack + 'basket-press.glb', size: 2.7, position: [6, 0, -1],
    summary: 'Areni-1 mağarasında istehsalla əlaqəli qurğular və qablar aşkar edilib. 2011-ci il tədqiqatı kimyəvi nümunələrlə şərab istehsalı ehtimalını gücləndirir.',
    body: 'Tədqiqatda malvidin piqmentini müəyyən edən üsul tətbiq olunub. Piqment təkbaşına kifayət etmir: qurğuların və qabların bir araya gəldiyi arxeoloji mühit nəticənin əsas hissəsidir.',
    evidence: 'Elmi tədqiqat', level: 'strong', finding: 'İstehsal qurğuları, saxsı qablar və kimyəvi analiz birlikdə qiymətləndirilir.', limitation: 'Bu taxta pres müasir təmsili modeldir; Areni-1-dəki qurğunun rekonstruksiyası deyil.',
    sources: ['areni'], question: 'Bir qab ilə bütöv istehsal sahəsi arasında dəlil baxımından nə fərq var?', note: 'Təxminən e.ə. 4000 tarixini məqalədəki ifadə kimi təqdim edin; erkən kimyəvi izlərlə qarışdırmayın.',
  },
  {
    id: 'amfora', title: 'Dənizləri aşan amfora', short: 'Aralıq dənizi', date: 'e.ə. I əsr', place: 'Baetulo · indiki Badalona, İspaniya', period: 'Antik dövr',
    model: 'badalona_laietana_wine_amphora_glb_1k.glb', size: 2.7, position: [-6, 0, -9],
    summary: 'Bu Laietana amforasının 3D modeli Badalona Muzeyinin kolleksiyasına bağlıdır. Qab şərabın saxlanması ilə yanaşı, daşınmasını və ticarətini düşünmək üçün real bir obyektdir.',
    body: 'Layihənin muzey qeydinə əsaslanan sənədləri bu tipi Baetulodan şərab ixracı ilə əlaqələndirir. Arxeoloji obyektin mənşəyini saxlamaq vacibdir: bu amfora Azərbaycan tapıntısı deyil.',
    evidence: 'Sənədləşdirilmiş obyekt', level: 'qualified', finding: 'Muzey kolleksiyasına bağlı amfora modeli və obyekt qeydi.', limitation: 'Model ticarət hekayəsini izah edir; bütün yayılma yollarını və ya tək mənşə nöqtəsini sübut etmir.',
    sources: ['roman'], question: 'Bir qabın forması uzun məsafəli daşınmaya necə kömək edə bilər?', note: 'Sərgidəki sənədləşdirilmiş obyekt ilə təmsili modellərin fərqini burada göstərin.',
    credit: 'Àmfora Laietana · Yiting Tan / Museu de Badalona · CC BY 4.0. 1K teksturalı GLB; həndəsə dəyişdirilməyib, səhnədə ölçü normallaşdırılıb.', creditUrl: 'https://sketchfab.com/3d-models/amfora-laietana-museu-de-badalona-8d968905907f4ca7971bf8ad6639b6d0', license: 'https://creativecommons.org/licenses/by/4.0/',
  },
  {
    id: 'orta-esr', title: 'Ənənə dəyişmədən qalmır', short: 'Orta əsrlər', date: 'Orta əsrlər', place: 'Mənbələri müqayisə edirik', period: 'Orta əsrlər',
    model: environments[2].file, size: 4.2, position: [6, 0, -9], environment: 'medieval',
    summary: 'Üzüm yetişdirmək, şərab istehsal etmək və onu içmək ayrı fəaliyyətlərdir. Birinə dair mənbə digərlərini avtomatik təsdiq etmir. Orta əsrlər haqqında da yerə və dövrə uyğun dəlil axtarmalıyıq.',
    body: '“Bir ənənə tam yox oldu” və ya “heç dəyişmədi” kimi geniş hökmləri yoxlamaq üçün konkret sənədlər lazımdır. Bu stansiya hazır tarixi hökm vermək əvəzinə, mənbəyə verəcəyimiz sualları qurur.',
    evidence: 'Açıq tədqiqat sualı', level: 'open', finding: 'Bu stansiyada konkret Azərbaycan məkanına aid təsdiqlənmiş şərabçılıq tapıntısı təqdim edilmir.', limitation: 'Monastır ümumi, süni intellektlə hazırlanmış memarlıq modelidir. Nə Azərbaycan məkanıdır, nə də şərab istehsalına dəlildir.',
    sources: [], question: 'Dini qayda, gündəlik təcrübə və istehsal haqqında eyni mənbə danışırmı?', note: 'Bu bölməni tarixi fakt kimi deyil, mənbə tənqidi məşqi kimi istifadə edin.',
  },
  {
    id: 'goygol', title: 'Helenendorfdan Göygölə', short: 'Göygöl', date: 'XIX əsr', place: 'Helenendorf · indiki Göygöl, Azərbaycan', period: 'Yeni dövr',
    model: pack + 'oak-barrel.glb', size: 2.4, position: [-6, 0, -17],
    summary: 'Alman məskənlərinin tarixində üzümçülük və şərabçılıq mühüm yer tutur. Göygölün XIX əsrə aid istehsal binaları bu sənaye irsinin izlərindəndir.',
    body: 'Bu, yerli üzümçülüyün başlanğıcı deyil, kommersiya istehsalının yeni bir fəslidir. “İlk zavod” və dəqiq təsis ili kimi iddialar ayrı-ayrı arxiv sənədləri ilə yoxlanmalıdır.',
    evidence: 'Rəsmi tarix və irs qeydi', level: 'qualified', finding: 'Göygölün rəsmi tarix səhifəsində XIX əsr şərab istehsalı binaları qeyd olunur.', limitation: 'Çəllək təmsili avadanlıqdır; Forer müəssisəsinin orijinal əşyası deyil. Naxçıvanda “6000 illik şərab” iddiası bu mənbələrlə təsdiqlənmir.',
    sources: ['helenendorf', 'germans'], question: 'Sənayeləşmə qədim bir fəaliyyətin miqyasını necə dəyişir?', note: 'Azərbaycan hissəsində təsdiqlənən irsi açıq arxeoloji suallardan ayırın. Xəritədəki tədqiqat qeydini də göstərin.',
  },
  {
    id: 'sovet', title: 'Böyümə və dönüş', short: 'Sovet dövrü', date: 'XX əsr · 1985', place: 'Azərbaycan', period: 'XX əsr',
    model: pack + 'vineyard-tractor.glb', size: 3.2, position: [6, 0, -17],
    summary: 'Azərbaycanın üzümçülük tarixi iri istehsalın yüksəlişi və sonrakı tənəzzüllə də bağlıdır. Dövlət proqramı bu dəyişiklikləri sahənin bərpası üçün tarixi kontekst kimi təqdim edir.',
    body: '1985-ci ildə başlayan alkoqol əleyhinə kampaniyanı iqtisadi və sosial kontekst daxilində oxumaq lazımdır. Müqayisə edilə bilən statistik sıra olmadan bağların azalmasını dəqiq rəqəmlərlə göstərmirik.',
    evidence: 'Rəsmi sənəd', level: 'qualified', finding: 'Üzümçülüyün inkişafına dair Dövlət Proqramında sahənin keçmişi və problemləri təsvir olunur.', limitation: 'Traktor ümumi müasir illüstrasiyadır; Sovet dövrünə aid müəyyən edilmiş texnika deyil. Rəqəmsal itki ölçüsü burada iddia edilmir.',
    sources: ['state'], question: 'Bir siyasi qərar təsərrüfata və ailələrin həyatına necə təsir edə bilər?', note: 'Rəqəm uydurmadan dəyişimin səbəb və nəticələrini müzakirə edin.',
  },
  {
    id: 'bu-gun', title: 'İrsin yeni fəsli', short: 'Bu gün', date: 'XXI əsr', place: 'Bağdan istehsala', period: 'Müasir dövr',
    model: environments[3].file, size: 4.3, position: [-6, 0, -25], environment: 'estate',
    summary: 'Üzümçülüyün bərpası və inkişafı üçün 2012–2020-ci illəri əhatə edən dövlət proqramı qəbul edilib. Müasir istehsalı öyrənərkən bağ, emal və saxlanma mərhələlərini ayrı izləyə bilərik.',
    body: 'Tarixi irs dəyişən texnologiya və yeni iqtisadi şəraitlə birlikdə yaşayır. Gördüyünüz təsərrüfat mərhələləri anlamaq üçün təmsili mühitdir; konkret Azərbaycan istehsalçısını göstərmir.',
    evidence: 'Rəsmi proqram', level: 'qualified', finding: '2011-ci ildə təsdiqlənmiş 2012–2020 inkişaf proqramı.', limitation: 'Proqramın qəbul edilməsi bütün hədəflərin yerinə yetirildiyini göstərmir. Burada cari istehsal statistikası iddia olunmur.',
    sources: ['state'], question: 'İrsin qorunması ilə texnologiyanın dəyişməsi necə yanaşı gedə bilər?', note: 'Mühitə keçərək bağ və zirzəmini göstərin; bunun təmsili olduğunu vurğulayın.',
  },
  {
    id: 'netice', title: 'Hekayənin ardınca, dəlilin izinə', short: 'Son söz', date: 'Düşünək', place: 'Sərginin son sualı', period: 'Nəticə',
    model: pack + 'vine-row-fruiting.glb', size: 3.8, position: [6, 0, -25],
    summary: 'Şərabın tarixi tək bir nöqtədən çəkilmiş düz xətt deyil. Qablar, bitki qalıqları, istehsal yerləri və sənədlər bu hekayənin müxtəlif hissələrini işıqlandırır.',
    body: 'Cənubi Qafqaz mühüm erkən dəlillərə malikdir. Azərbaycanın tarixi haqqında danışarkən isə hər iddianın öz mənbəyini soruşuruq. Yaxşı tarix hekayəsi bilmədiklərini də açıq göstərir.',
    evidence: 'Sərginin nəticəsi', level: 'method', finding: 'Dəlillərin müxtəlif növlərini müqayisə etdik.', limitation: 'Bu sərgi bütün dövrləri və bütün yayılma yollarını tam əhatə etmir.',
    sources: ['georgia', 'iran', 'areni'], question: 'İndi hansı fikri mənbə ilə əsaslandıra bilərsiniz?', note: 'Sinifdən bir iddia, onu dəstəkləyən mənbə və həmin mənbənin bir məhdudiyyətini soruşun.',
  },
];

export const defaultCredit = {
  text: '3D Assets · CC0 1.0. Süni intellektlə hazırlanmış təmsili model; həqiqi tapıntı və ya tarixi rekonstruksiya deyil. Səhnədə ölçü və yerləşmə dəyişdirilib.',
  url: 'https://3dassets.dev/packs/vineyard-and-winery', license: 'https://creativecommons.org/publicdomain/zero/1.0/',
};

export function creditFor(exhibit) {
  const urls = { prehistoric: 'https://3dassets.dev/packs/prehistoric-survivor-settlement', medieval: 'https://3dassets.dev/packs/medieval-monastery-and-scriptorium' };
  return { text: exhibit.credit || defaultCredit.text, url: exhibit.creditUrl || urls[exhibit.environment] || defaultCredit.url, license: exhibit.license || defaultCredit.license };
}
