const letras = ['a','b','c','d','e','f','g','h']

const piaoBranco = ['a2','b2','c2','d2','h2','e2','f2','g2']
const promocaoPiaoBranco = ['a8','b8','c8','d8','e8','f8','g8','h8']
const torreBranco = ['a1','h1']
const cavaloBranco = ['b1','g1']
const bispoBranco = ['c1','f1']
const rainhaBranco = ['d1']
const reiBranco = ['e1']

const piaoPreto = ['a7','b7','c7','d7','e7','f7','g7','h7']
const promocaoPiaoPreto = ['a1','b1','c1','d1','e1','f1','g1','h1']
const bispoPreto = ['c8','f8']
const cavaloPreto = ['b8','g8']
const torrePreto = ['a8','h8']
const rainhaPreto = ['d8']
const reiPreto = ['e8']

let enPassanteDestino = null
let pecaSelecionada = ''
let jogadorDaVez = 'white'
let reiPrimeiroMovimento = { 'white': true, 'black': true }
let torrePrimeiroMovimento = [...torreBranco, ...torrePreto]
let trocaReiTorre = []

const tabuleiroPosicoes = []
let jogadasPossiveis = []

const tabuleiro = document.querySelector('.tabuleiro')

for(let i = 8; i > 0; i--){
	for(let j = 0; j < 8; j++){
		const pecaBox = document.createElement('div')
		const imgPeca = document.createElement('img')
		const pecaId = `${letras[j] + i}`
		pecaBox.classList.add('bloco')
		pecaBox.id = pecaId

		//pecaBox.classList.add(`${letras[j] + i}`)
		pecaBox.innerText = `[${letras[j].toUpperCase()}][${i}]`

		if(i % 2 === j % 2){
			pecaBox.classList.add('black')
		} else {
			pecaBox.classList.add('white')
		}

		tabuleiroPosicoes[pecaId] = ''

		tabuleiro.appendChild(pecaBox)
		pecaBox.addEventListener('click', jogando)
	}	
}

posicionaPecas(piaoBranco, 'pawn-white')
posicionaPecas(torreBranco, 'tower-white')
posicionaPecas(cavaloBranco, 'horse-white')
posicionaPecas(bispoBranco, 'bishop-white')
posicionaPecas(rainhaBranco, 'queen-white')
posicionaPecas(reiBranco, 'king-white')

posicionaPecas(piaoPreto, 'pawn-black')
posicionaPecas(torrePreto, 'tower-black')
posicionaPecas(cavaloPreto, 'horse-black')
posicionaPecas(bispoPreto, 'bishop-black')
posicionaPecas(rainhaPreto, 'queen-black')
posicionaPecas(reiPreto, 'king-black')

function pecaInfo(nomePeca, pecaHtml){
	const nome = nomePeca.replace(/-(white|black)/, '')
	const cor = nomePeca.match(/black|white/).toString()
	const info = {
		nome,
		cor,
		pecaHtml,
		pecaClasse: nomePeca
	}
	return info
}

function posicionaPecas(posicoesPecas, nomePeca){
	posicoesPecas.map(value =>{
		const id = `#${value}`
		const pecaCasa = document.querySelector(id)
		pecaCasa.classList.add(nomePeca)
		tabuleiroPosicoes[value] = pecaInfo(nomePeca, pecaCasa)
	})
}

function jogando(e){
	const target = e.target
	const peca = tabuleiroPosicoes[target.id]
	const corPeca = peca.cor
	const suaVez = corPeca === jogadorDaVez ? true : false

	if(!pecaSelecionada && peca && suaVez) {
		pecaSelecionada = target.id
		const nomePeca = tabuleiroPosicoes[pecaSelecionada].nome
		switch(nomePeca){
			case 'pawn':{
				jogadasPossiveisPiao(target)
				addMarcacaoJogadas(jogadasPossiveis)
				marcaPecaSelecionada(target)
				break;
			}
			case 'tower':{
				jogadasPossiveisTorreRainha(target)
				addMarcacaoJogadas(jogadasPossiveis)
				marcaPecaSelecionada(target)
				break;
			}
			case 'bishop':{
				jogadasPossiveisBispoRainha(target)
				addMarcacaoJogadas(jogadasPossiveis)
				marcaPecaSelecionada(target)
				break;
			}
			case 'king':{
				jogadasPossiveisRei(target,corPeca)
				addMarcacaoJogadas(jogadasPossiveis)
				marcaPecaSelecionada(target)
				break;
			}
			case 'queen':{
				jogadasPossiveisRainha(target)
				addMarcacaoJogadas(jogadasPossiveis)
				marcaPecaSelecionada(target)
				break;
			}
			case 'horse':{
				jogadasPossiveisCavalo(target)
				addMarcacaoJogadas(jogadasPossiveis)
				marcaPecaSelecionada(target)
				break;
			}
		}
		
	} else if(pecaSelecionada === target.id) {
		removeMarcacoes()		
	}	else if (pecaSelecionada && peca && suaVez) {
		removeMarcacoes()		
		jogando(e)
	} else if(pecaSelecionada) {
		const casaOrigem = pecaSelecionada
		const nomePeca = tabuleiroPosicoes[pecaSelecionada].nome
		const cor = tabuleiroPosicoes[pecaSelecionada].cor
		let idDestino = target.id		
		let podeTrocaComTorre = null
		let jogadaValida = jogadasPossiveis.find(value => value === target.id)


		if(enPassanteDestino && idDestino === enPassanteDestino){
			idDestino = enPassanteDestino
			jogadaValida = true
		}

		if(nomePeca === 'king' && reiPrimeiroMovimento[cor]){
			podeTrocaComTorre = trocaReiTorre.find(value => value === idDestino)
			if(podeTrocaComTorre){
				jogadaValida = true
			}
			reiPrimeiroMovimento[cor] = false
		}

		if(nomePeca === 'tower'){
			
		}

		if(jogadaValida){
			const casaDestinoTemPeca = tabuleiroPosicoes[target.id]

			if(nomePeca === 'pawn'){
				const primeiroMovimento = retornaPrimeiroMovimento(cor, pecaSelecionada)
				const temPromo = piaoPromocao(jogadaValida, cor)
				if(temPromo){
					telaDePromocaoPiao(target.id)
				}
				if(primeiroMovimento && target.id === jogadasPossiveis[1]){
					verificaEnPassante(jogadaValida, target)
				}
			}
			
			movimentaPeca(casaOrigem, idDestino, target, casaDestinoTemPeca, podeTrocaComTorre)
			removeMarcacoes()			
			mudarJogador(cor)
		}
	}
}

function jogadasPossiveisRainha(target){
	jogadasPossiveisBispoRainha(target)
	jogadasPossiveisTorreRainha(target)
}

function jogadasPossiveisBispoRainha(target){
	let idArray = Array.from(target.id)
	let indexLetra = letras.findIndex(value => value === idArray[0])
	let jogadasEncontradas = true
	const qwe = [-1,1]
	for(const q of qwe){
		jogadasEncontradas = true
		idArray = Array.from(target.id)
		indexLetra = letras.findIndex(value => value === idArray[0])

		while(jogadasEncontradas){
			indexLetra = indexLetra + q
			idArray[0] = letras[indexLetra]
			idArray[1] = (Number(idArray[1]) + q).toString()
			const casa = tabuleiroPosicoes[idArray.join('')]	
			jogadasEncontradas = validacaoVerticalHorizontal(idArray)
		}
		
		jogadasEncontradas = true
		idArray = Array.from(target.id)
		indexLetra = letras.findIndex(value => value === idArray[0])

		while(jogadasEncontradas){
			indexLetra = indexLetra + q
			idArray[0] = letras[indexLetra]
			idArray[1] = (Number(idArray[1]) - q).toString()
			const casa = tabuleiroPosicoes[idArray.join('')]	
			jogadasEncontradas = validacaoVerticalHorizontal(idArray)
		}
	}
}

function caputurandoPecaEnPassante(idDestinoPassante){
	const idDestinoArray = Array.from(idDestinoPassante)
	const idOrigemArray = Array.from(pecaSelecionada)
	const valorVertical = Number(idDestinoArray[1]) > Number(idOrigemArray[1]) ? -1 : 1
	idDestinoPassante = idDestinoArray.join('')

	idDestinoArray[1] = (Number(idDestinoArray[1]) + valorVertical).toString()
	idDestinoPassante = idDestinoArray.join('')
	tabuleiroPosicoes[idDestinoPassante].pecaHtml.classList.remove(tabuleiroPosicoes[idDestinoPassante].pecaClasse)
	tabuleiroPosicoes[idDestinoPassante] = ''

	enPassanteDestino = null
}

function movimentaPeca(casaOrigem, casaDestino, htmlDestino, casaDestinoTemPeca, podeTrocaComTorre){
	if(casaDestinoTemPeca){
		tabuleiroPosicoes[casaDestino].pecaHtml.classList.remove(tabuleiroPosicoes[casaDestino].pecaClasse)
	}

	if(enPassanteDestino === casaDestino){
		caputurandoPecaEnPassante(casaDestino)
	}

	if(podeTrocaComTorre){
		const k = mudaTorreNaTrocaDoRei(casaDestino)
		movimentaPeca(k.casaOrigem, k.casaDestino, k.htmlDestino, k.casaDestinoTemPeca, k.podeTrocaComTorre)
	}

	tabuleiroPosicoes[casaOrigem].pecaHtml.classList.remove(tabuleiroPosicoes[casaOrigem].pecaClasse)
	tabuleiroPosicoes[casaDestino] = {...tabuleiroPosicoes[casaOrigem]}
	tabuleiroPosicoes[casaDestino].pecaHtml = htmlDestino
	htmlDestino.classList.add(tabuleiroPosicoes[casaOrigem].pecaClasse)
	tabuleiroPosicoes[casaOrigem] = ''
}

function jogadasPossiveisTorreRainha(target){
	let idArray = Array.from(target.id)
	let indexLetra = letras.findIndex(value => value === idArray[0])
	let jogadasEncontradas = false
	const calculoLaterais = [-1, 1]

	for(const valorLateral of calculoLaterais){		
		indexLetra = letras.findIndex(value => value === idArray[0])
		jogadasVerticalHorizontal(jogadasEncontradas, valorLateral, target, indexLetra)
	}
}

function mudaTorreNaTrocaDoRei(reiCasaDestino){
	let casaOrigemRei = Array.from(pecaSelecionada)	
	let casaDestinoRei = Array.from(reiCasaDestino)
	let torreDestino = casaDestinoRei
	let htmlTorreDestino = ''

	const indexOrigem = letras.findIndex(value => value === casaOrigemRei[0])
	const indexDestino = letras.findIndex(value => value === casaDestinoRei[0])

	const proximaCasaLetra = indexOrigem < indexDestino ? 1 : -1

	casaDestinoRei[0] = letras[indexDestino + proximaCasaLetra]

	if(tabuleiroPosicoes[casaDestinoRei.join('')].nome === 'tower'){
		const letraIndex = letras.findIndex(value => value === casaDestinoRei[0])
		casaDestinoRei = casaDestinoRei.join('')
		torreDestino[0] = letras[letraIndex - 2]
		torreDestino = torreDestino.join('')
		htmlTorreDestino = document.getElementById(torreDestino)
	} else {
		casaDestinoRei[0] = letras[0]
		torreDestino = [...casaDestinoRei]
		torreDestino[0] = letras[3]
		casaDestinoRei = casaDestinoRei.join('')
		torreDestino = torreDestino.join('')
		htmlTorreDestino = document.getElementById(torreDestino)
	}

	return {
		casaOrigem: casaDestinoRei,
		casaDestino: torreDestino,
		htmlDestino: htmlTorreDestino,
		casaDestinoTemPeca: false,
		podeTrocaComTorre: false
	}
}


function jogadasVerticalHorizontal(jogadasEncontradas, valorLateral, target, indexLetra){	
	jogadasEncontradas = true
	idArray = Array.from(target.id)
	while(jogadasEncontradas){
		indexLetra = indexLetra - valorLateral
		idArray[0] = letras[indexLetra]	
		jogadasEncontradas = validacaoVerticalHorizontal(idArray)
	}

	jogadasEncontradas = true
	idArray = Array.from(target.id)
	while(jogadasEncontradas){
		idArray[1] = (Number(idArray[1]) + valorLateral).toString()
		jogadasEncontradas = validacaoVerticalHorizontal(idArray)
	}
}

function validacaoVerticalHorizontal(idArray){
	const casa = tabuleiroPosicoes[idArray.join('')]
	const cor = tabuleiroPosicoes[pecaSelecionada].cor
	if(casa && casa.cor === cor) return false
	if(casa !== undefined){
		jogadasPossiveis.push(idArray.join(''))
	}
	if(casa && casa.cor !== cor) return false
	if(casa === undefined) return false

	return true
}


function mudarJogador(cor){
	jogadorDaVez = cor === 'black' ? 'white' : 'black'
}

function piaoPromocao(casaPromocao, cor){
	let temPromocao = false
	let pecaPromo = ''
	if(cor === 'white'){
		pecaPromo = promocaoPiaoBranco.find(value => value === casaPromocao)
	} else {
		pecaPromo = promocaoPiaoPreto.find(value => value === casaPromocao)
	}

	if(pecaPromo){
		temPromocao = true
	}

	return temPromocao
}

function verificaDiagonalPiao(pecaId, valorParaCasa){
	const calculoDiagonais = [-1, 1]
	const pecaIdArray = Array.from(pecaId)
	const letraIndex = letras.findIndex((value, index) => value === pecaIdArray[0])
	const pecaSelecionadaCor = tabuleiroPosicoes[pecaSelecionada].cor

	for(let i = 0; i < 2; i++){
		const indexLetraDiagonal = letraIndex + calculoDiagonais[i]
		const temLetraDiagonal = letras[indexLetraDiagonal] ? true : false
		if(temLetraDiagonal){
			const numeroDiagonal = (Number(pecaIdArray[1]) + valorParaCasa).toString()
			const idDiagonal = `${letras[indexLetraDiagonal] + numeroDiagonal}`
			const diagonalPecaCor = tabuleiroPosicoes[idDiagonal].cor
			const podeMarca = pecaSelecionadaCor !== diagonalPecaCor ? true : false

			if(tabuleiroPosicoes[idDiagonal] && podeMarca){
				jogadasPossiveis.push(idDiagonal)
			}
		}
	}
}

function jogadasPossiveisPiao(target){
	const idArray = Array.from(target.id) 
	const cor = tabuleiroPosicoes[target.id].cor
	let destinoTemPeca = ''
	let jogada = ''	
	let primeiroMovimento = false
	let valorParaCasa = 0

	if(cor === 'white'){
		valorParaCasa = 1
		primeiroMovimento = retornaPrimeiroMovimento(cor, target.id)
	} else if(cor === 'black'){
		valorParaCasa = -1
		primeiroMovimento = retornaPrimeiroMovimento(cor, target.id)		
	}

	if(primeiroMovimento){
		for(let i = 0; i < 2; i++){
			idArray[1] = (Number(idArray[1]) + valorParaCasa).toString()
			jogada = idArray.join('')
			destinoTemPeca = tabuleiroPosicoes[jogada]
			if(destinoTemPeca){
				break
			}
			if(!destinoTemPeca){
				jogadasPossiveis.push(jogada)
			}
		}
	} else {
		idArray[1] = (Number(idArray[1]) + valorParaCasa).toString()
		jogada = idArray.join('')
		destinoTemPeca = tabuleiroPosicoes[jogada]
		if(!destinoTemPeca){
			jogadasPossiveis.push(jogada)
		}		
	}
	verificaDiagonalPiao(target.id,valorParaCasa)
}

function retornaPrimeiroMovimento(cor, idPeca){
	let primeiroMovimento = false
	if(cor === 'white'){
		piaoBranco.find((value) => {
			if(value === idPeca){
				primeiroMovimento = true
			}
		})
	} else if(cor === 'black'){
		piaoPreto.find((value) => {
			if(value === idPeca){
				primeiroMovimento = true
			}
		})
	}

	return primeiroMovimento
}

function addMarcacaoJogadas(jogadasPossiveis){
	for(const jogada of jogadasPossiveis){
		const casaTemPeca = tabuleiroPosicoes[jogada]
		if(casaTemPeca){
			casaTemPeca.pecaHtml.classList.add('capturar-peca')
		} else {
			const casa = document.getElementById(jogada)
			casa.classList.add('jogadas-possiveis')
		}
	}
	if(enPassanteDestino){
		document.getElementById(enPassanteDestino).classList.add('passante')
	}
}


function removeMarcacoes(){
	const pecaSelecionadaHtml = document.querySelector('.peca-selecionada')
	const passante = document.querySelector('.passante')
	const jogadasPossiveisHtml = document.querySelectorAll('.jogadas-possiveis')
	const capturarPecas = document.querySelectorAll('.capturar-peca')
	const check = document.querySelector('.check')
	const torreRei = document.querySelectorAll('.troca-rei-torre')

	if(pecaSelecionadaHtml){
		pecaSelecionadaHtml.classList.remove('peca-selecionada')
	}

	if(check && !checkRei){
		check.classList.remove('check')
	}

	if(passante){
		passante.classList.remove('passante')
	}

	for(const marcacao of jogadasPossiveisHtml){
		marcacao.classList.remove('jogadas-possiveis')
	}

	for(const marcacao of capturarPecas){
		marcacao.classList.remove('capturar-peca')
	}

	for(const marcacao of torreRei){
		marcacao.classList.remove('troca-rei-torre')
	}

	pecaSelecionada = ''
	jogadasPossiveis = []
	trocaReiTorre = []
}

function marcaPecaSelecionada(target){
	target.classList.add('peca-selecionada')
}

function telaDePromocaoPiao(idDestino){
	const nomePecas = [`queen-${jogadorDaVez}`,`horse-${jogadorDaVez}`,`tower-${jogadorDaVez}`,`bishop-${jogadorDaVez}`]
	const caixaPromocao = document.createElement('div')
	const caixaPeca = document.createElement('div')

	caixaPromocao.classList.add('caixa-promocao')
	caixaPeca.classList.add('caixa-pecas')

	for(const nome of nomePecas){
		const peca = document.createElement('div')
		peca.addEventListener('click', mudaPecaPromocao)
		peca.idDestino = idDestino
		peca.classList.add(nome)
		peca.classList.add('peca-promocao')
		peca.classList.add('bloco')
		peca.id = nome
		caixaPeca.appendChild(peca)
	}

	caixaPromocao.appendChild(caixaPeca)
	tabuleiro.appendChild(caixaPromocao)
}

function mudaPecaPromocao(e){
	const idDestino = e.target.idDestino
	const nomePeca = e.target.id
	const pecaDestino = tabuleiroPosicoes[idDestino]
	pecaDestino.pecaHtml.classList.remove(pecaDestino.pecaClasse)
	pecaDestino.pecaHtml.classList.add(nomePeca)
	pecaDestino.pecaClasse = nomePeca
	pecaDestino.nome = nomePeca.match(/horse|queen|tower|bishop/).toString()
	
	document.querySelector('.caixa-promocao').remove()
	removeMarcacoes()
	pecaSelecionada = ''
}

function verificaEnPassante(temJogada, target){
	const id = target.id
	const numeroCasa = jogadorDaVez === 'white' ? -1	: 1
	let idArray = Array.from(id)
	const letraIndex = letras.findIndex(value => value === idArray[0])	
	const laterais = [-1,1]
	let temPassante = false

	for(const lateral of laterais){
		idArray[0] = letras[letraIndex + lateral]
		const peca = tabuleiroPosicoes[idArray.join('')]
		if(peca && peca.cor !== jogadorDaVez){
			temPassante = true
		}
	}

	if(temPassante){
		idArray = Array.from(id)
		idArray[1] = (Number(idArray[1]) + numeroCasa).toString()
		enPassanteDestino = idArray.join('')
	}

	return temPassante
}

function jogadasPossiveisRei(target,cor){	
	const valoresLaterais = [-1,1]
	let idArray = Array.from(target.id)
	let indexLetraTarget = letras.findIndex(value => value === idArray[0])

	if(reiPrimeiroMovimento[cor]){
		for(const lateral of valoresLaterais){
			idArray = Array.from(target.id)			
			let temCasa = true			
			let indexLetra = letras.findIndex(value => value === idArray[0])
			while(temCasa){
				indexLetra = indexLetra + lateral
				idArray[0] = letras[indexLetra]
				const peca = tabuleiroPosicoes[idArray.join('')]
				if(peca){
					temCasa = false
				}
				if(peca && peca.nome === 'tower'){
					const primeiroMove = torrePrimeiroMovimento.find(value => value === idArray.join(''))
					if(primeiroMove){
						const letraTrocaReiTorre = letras.findIndex(value => value === idArray[0])
						if(letraTrocaReiTorre > indexLetraTarget){
							idArray[0] = letras[indexLetraTarget + 2]
						} else {
							idArray[0] = letras[indexLetraTarget - 2]
						}
						trocaReiTorre.push(idArray.join(''))
						document.getElementById(idArray.join('')).classList.add('troca-rei-torre')
					}
				}
				if(!letras[indexLetra])
					temCasa = false
			}

		}
	}

	for(const lateral of valoresLaterais){
		idArray = Array.from(target.id)	
		jogadasHorizontalDiagonalRei(indexLetraTarget, lateral, idArray)

		idArray = Array.from(target.id)
		idArray[0] = letras[indexLetraTarget]
		idArray[1] = (Number(idArray[1]) + lateral).toString()
		addJogadasRei(idArray)
		for(const lateral of valoresLaterais){
			jogadasHorizontalDiagonalRei(indexLetraTarget, lateral, idArray)
		}
	}	
}


function jogadasHorizontalDiagonalRei(indexLetraTarget, lateral, idArray){
	let novoIndexLetra = indexLetraTarget + lateral
	idArray[0] = letras[novoIndexLetra]	
	addJogadasRei(idArray)
}

function addJogadasRei(idArray){
	const casa = tabuleiroPosicoes[idArray.join('')]
	if(casa !== undefined){
		if(!casa || (casa && casa.cor !== jogadorDaVez)){
			jogadasPossiveis.push(idArray.join(''))
		}
	}
}

function jogadasPossiveisCavalo(target){
	let idArray = Array.from(target.id)
	let indexLetra = letras.findIndex(value => value === idArray[0])
	const valoresHorizontalVertical = [-2,2]
	const valoresLaterais = [-1,1]

	for(const horizontalVertical of valoresHorizontalVertical){
		for(const lateral of valoresLaterais){
			caculandoJogadasCavalo(horizontalVertical, lateral, target, idArray)
			caculandoJogadasCavalo(lateral, horizontalVertical, target, idArray)
		}		
	}
}

function caculandoJogadasCavalo(horizontalVertical, lateral, target, idArray){	
	let casa = ''
	idArray = Array.from(target.id)
	idArray[1] = (Number(idArray[1]) + horizontalVertical).toString()
 	indexLetra = letras.findIndex(value => value === idArray[0])
	indexLetra = indexLetra + lateral
	idArray[0] = letras[indexLetra]
	casa = tabuleiroPosicoes[idArray.join('')]

	if(casa !== undefined){
		if(!casa || (casa && casa.cor !== jogadorDaVez)){
			jogadasPossiveis.push(idArray.join(''))
		}
	}
}
