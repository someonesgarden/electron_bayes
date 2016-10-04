var DIC_URL     = "node_modules/kuromoji/dist/dict/";
var tokenizer   = null;
var bayes       = require('bayes');
const BUTTON_CLASSNAME = '';
var gakusyu_left_btn  = document.querySelector('button#gakusyu_left_btn');
var gakusyu_right_btn = document.querySelector('button#gakusyu_right_btn');

var leftKey           = document.querySelector('input#leftKey');
var rightKey          = document.querySelector('input#rightKey');

var vm = new Vue({
    el  : "#bayes_yosoku",
    data: {
        leftText  : "",
        rightText : "",
        leftKey   : "",
        rightKey  : "",
        yosokuText: "",
        yosokuResult:"",
        tokens    : [],
        isLoading : true,
        message   : "Loading dictionaries ...",
        svgStyle  : "hidden",
        showmode  : "tokenize"
    },
    methods: {
        tokenize: function (txt) {
            if (txt == "" || tokenizer == null) {
                vm.tokens = [];
                return;
            }
            try {
                var words = tokenizer.tokenize(txt);
                vm.tokens=[];
                for(var i=0;i<words.length;i++){
                    var word=words[i].surface_form;
                    if (!word.match(/[.。、=＝！￥"「」#%&$・\/\n\s\t?]/)) {
                        //console.log(words[i].surface_form);
                        vm.tokens.push(words[i].surface_form);
                    }
                }
                //console.log(vm.tokens);
                return vm.tokens;
            } catch (e) {
                console.log(e);
                vm.tokens = [];
            }
        }
    }
});

// フォームの内容が変化したらtokenizeする
vm.$watch("leftText", function (value) {
    vm.svgStyle = "hidden";
    //vm.tokenize(vm.leftText);
    //var button_classname = (vm.tokens.length == 0) ? BUTTON_CLASSNAME + ' disabled' : BUTTON_CLASSNAME;
});


vm.$watch("rightText", function (value) {
    vm.svgStyle = "hidden";
    //var res=vm.tokenize(vm.rightText);
    var button_classname = (vm.tokens.length == 0) ? BUTTON_CLASSNAME + ' disabled' : BUTTON_CLASSNAME;
});

vm.$watch("yosokuText", function(value){

    vm.yosokuResult = " ------- ";
    if(vm.yosokuText.trim()!="") {
        console.log("yosokuText="+vm.yosokuText);
        yosoku(vm.yosokuText);
    }
});



// Load and prepare tokenizer
kuromoji.builder({ dicPath: DIC_URL }).build(function (error, _tokenizer) {
    if (error != null) {
        console.log(error);
    }
    tokenizer       = _tokenizer;
    vm.leftText    = "夏目漱石は、日本の小説家、評論家、英文学者。江戸の牛込馬場下横町出身。大学時代に正岡子規と出会い、俳句を学ぶ。帝国大学英文科卒業後、松山で愛媛県尋常中学校教師、熊本で第五高等学校教授などを務めた後、イギリスへ留学。帰国後、東京帝国大学講師として英文学を講じながら、「吾輩は猫である」を雑誌『ホトトギス』に発表。これが評判になり「坊っちゃん」「倫敦塔」などを書く。";
    vm.rightText   = "織田信長は、戦国時代から安土桃山時代にかけての武将・戦国大名。三英傑の一人。尾張国（現在の愛知県）の古渡城主・織田信秀の嫡男。尾張守護代の織田氏の中でも庶流・弾正忠家の生まれであったが、父の代から主家や尾張守護の斯波家をも凌ぐ力をつけ、家督争いの混乱を収めて尾張を統一し、桶狭間の戦いで今川義元を討ち取ると、婚姻による同盟策などを駆使しながら領土を拡大した。";
    vm.leftKey      = "夏目漱石";
    vm.rightKey     = "織田信長";
    vm.yosokuResult = " ------- ";
    vm.isLoading    = false;
    vm.message      = "Ready";
    //dl_button.className= BUTTON_CLASSNAME;
});


gakusyu_left_btn.onclick = function(){
    vm.showmode = "study";
    console.log("leftKey="+leftKey.value);
    console.log("key="+vm.leftKey);
    //console.log("text="+vm.leftText);
    classifier.learn(vm.leftText, leftKey.value);

};

gakusyu_right_btn.onclick = function(){
    vm.showmode = "study";
    console.log("rightKey="+rightKey.value);
    console.log("key="+vm.rightKey);
    classifier.learn(vm.rightText, rightKey.value);
};

var classifier = bayes({
    tokenizer: function (text) {
        //console.log("text=" + text);
        var res = vm.tokenize(text);
        console.log(res);
        return res;
    }
});

function yosoku(text){
    vm.yosokuResult =  classifier.categorize(text);

}

function categorize(text) {
    var r = classifier.categorize(text);
    console.log("カテゴリ=[" + r + "] - " + text);
}
