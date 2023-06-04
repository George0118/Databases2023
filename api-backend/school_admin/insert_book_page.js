const pool = require('../connect');
const express = require('express');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const router = express.Router();

router.get('/', function (req, res) {
    const successMessage = req.flash('success');
    const failureMessage = req.flash('error');

    const school_id = req.query.school_id;
    const user_id = req.query.user_id;

    const languageCodes = ["AFR", "AMH", "ARA", "ASM", "AYM", "AZE", "BEN", "BIS", "BHO", "BUL", "BUR", "CAT", "CEB", "CES", "CHI", "CMN", "CRO", "CZE", "DAN", "DEU", "DUT", "ENG", "EST", "EWE", "FIN", "FRA", "FUL", "GLG", "GLE", "GRE", "GUI", "GUJ", "HAT", "HAU", "HEB", "HIN", "HMO", "HRV", "HUN", "IBO", "ILO", "ITA", "JAV", "KAL", "KAN", "KAZ", "KHM", "KIK", "KIN", "KIR", "KOR", "KUR", "LAT", "LAV", "LIT", "LOZ", "LUG", "MAI", "MAL", "MAO", "MAR", "MAY", "MSA", "MON", "NEP", "NOB", "NYA", "ORI", "PAN", "POL", "PUS", "QUE", "RAR", "RON", "RUN", "RUS", "SLK", "SLV", "SOM", "SOT", "SPA", "SRP", "SWE", "SWA", "TAI", "TAM", "TGL", "TIR", "TON", "TUM", "TUR", "UZB", "VIE", "WOL", "YOR", "YUE", "ZUL"];

    const categories = [
        'Ιστορία (History)',
        'Μυθιστόρημα (Novel)',
        'Φαντασία (Fantasy)',
        'Μυστήριο (Mystery)',
        'Θρίλερ (Thriller)',
        'Ρομαντικό (Romance)',
        'Ποίηση (Poetry)',
        'Διηγήματα (Short Stories)',
        'Αυτοβελτίωση (Self-Improvement)',
        'Θρησκεία (Religion)',
        'Φιλοσοφία (Philosophy)',
        'Ψυχολογία (Psychology)',
        'Παιδικά βιβλία (Childrens Books)',
        'Ταξίδια (Travel)',
        'Τέχνη (Art)',
        'Αρχιτεκτονική (Architecture)',
        'Μαγειρική (Cooking)',
        'Αθλητισμός (Sports)',
        'Επιστημονικά (Science)',
        'Οικονομία (Economics)',
        'Πολιτική (Politics)',
        'Βιογραφίες (Biographies)',
        'Μαθηματικά (Mathematics)',
        'Γλωσσολογία (Linguistics)',
        'Εκπαίδευση (Education)',
        'Περιβάλλον (Environment)',
        'Κοινωνιολογία (Sociology)',
        'Μουσική (Music)',
        'Δικαίωμα (Law)',
        'Επιστημονική Φαντασία (Science Fiction)',
        'Φανταστική Νεανική Λογοτεχνία (Young Adult Fantasy)',
        'Ιστορικό Μυθιστόρημα (Historical Novel)',
        'Πολεμική Λογοτεχνία (War Literature)',
        'Αστυνομική Λογοτεχνία (Crime Fiction)',
        'Επιστημονική Διαφήμιση (Science Non-Fiction)',
        'Αυτοβιογραφία (Autobiography)',
        'Μαγικό Ρεαλισμό (Magical Realism)',
        'Θρησκευτική Λογοτεχνία (Religious Literature)',
        'Κλασική Λογοτεχνία (Classic Literature)',
        'Περιπέτεια (Adventure)',
        'Παραμύθια (Fairy Tales)',
        'Μυθολογία (Mythology)',
        'Τραγωδία (Tragedy)',
        'Κωμωδία (Comedy)',
        'Θέατρο (Theater)',
        'Τεχνολογία (Technology)',
        'Επιστήμη της Υγείας (Health Science)',
        'Περιπλανήσεις (Journeys)',
        'Πολιτισμολογία (Cultural Studies)'
      ];

    const filePath = "../frontend/views/school_admin/insert_book_page.ejs";
    fs.readFile(filePath, 'utf8', function (err, html) {
        if (err) {
            console.error('Error reading HTML file:', err);
            res.status(500).send('Internal Server Error');
        } else {
            const renderedHtml = ejs.render(html, { user_id, school_id, successMessage, failureMessage, languages: languageCodes, categories: categories });
            res.send(renderedHtml);
        }

    });
});




module.exports = router;
