import { View, Button, Alert } from 'react-native'
import { useState } from 'react'
import Animated, {
  useAnimatedStyle,
  // Ele é reativo, se esse valor muda, acaba que reflete no estilo da nossa animação a onde ele esta sendo usado, ou seja agora a animação é dinamica de acordo com um dado da nossa aplicação passado para nossa animação. E para que a animação seja fluida é acontecido em threads diferentes, temos uma thread do JS e uma thread da UI do usuario que é a onde acontece a animação, igual no js web com os workers threads, a onde coisas pesadas por exemplo leitura de arquivo no PC e aqui no casso é a animação acontecem em sub threads do Smartphone
  useSharedValue,
  // Para fazer as transições de quanto ate quanto, a duração
  withTiming,
  Easing,
  withSpring,
  // Eu posso escolher a onde que eu quero rodar a minha animação, se eu quero rodar na thread do JS ou na thread da UI
  runOnJS,
  runOnUI
} from 'react-native-reanimated'

// Principios do reanimated
/*
  1º - Componente animado
  2º - Estilização animada
  3º - useSharedValue para trabalhar com esse valor dentro da nossa animação
*/

// Para trabalhar com gestos
import { GestureDetector, Gesture } from 'react-native-gesture-handler'

import { styles } from './styles'
import { Ball } from '../../components/Ball'

export function Home() {
  const [isActive, setIsActive] = useState(false)
  const scale = useSharedValue(1)
  const rotation = useSharedValue(0)
  const position = useSharedValue(0)

  function handleAnimation() {
    if (scale.value === 1) {
      scale.value = withTiming(1.5, {
        // duration: 700,
        easing: Easing.bounce
      })
    } else {
      // scale.value = withTiming(1, {
      //   duration: 700,
      //   easing: Easing.elastic(3)
      // })
      scale.value = withSpring(1)
    }
  }

  const onTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      runOnJS(Alert.alert)('toque', 'Você tocou no botão')
    })

  const onLongPress = Gesture.LongPress()
    .minDuration(200)
    .onStart(() => {
      scale.value = withTiming(1.5, {
        // duration: 700,
        easing: Easing.bounce
      })
    })
    .onEnd(event => {
      scale.value = withTiming(1, {
        // duration: 700,
      })
      console.log('onEnd', event.duration, ' ms')
    })
    .onFinalize(event => {
      // Tempo que o usuario ficou pressionando
      console.log('onFinalize', event.duration, ' ms')
    })

  const onRotation = Gesture.Rotation()
    // Ele observar o tempo todo o Gesto
    .onUpdate(event => {
      rotation.value = event.rotation
    })
    .onEnd(event => {
      rotation.value = withTiming(0)
    })

  // Bom para trabalhar com imgs
  const Pinch = Gesture.Pinch().onUpdate(event => {
    scale.value = event.scale
  })

  const onPan = Gesture.Pan()
    .onUpdate(event => {
      position.value = event.translationX
    })
    .onEnd(event => {
      position.value = withTiming(0)
    })

  const onPanButton = Gesture.Pan()
    .onStart(event => {
      runOnJS(setIsActive)(true)
    })
    .onUpdate(event => {
      position.value = event.translationX
    })
    .onEnd(event => {
      position.value = withTiming(0)
      runOnJS(setIsActive)(false)

    })

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        // scale: 1 --> fixo
        scale: scale.value
      },
      {
        rotateZ: `${(rotation.value / Math.PI) * 180}deg`
      },
      {
        translateX: position.value
      }
    ]
  }))

  return (
    <View style={styles.container}>
      {/* Um so gesto */}
      {/* <GestureDetector gesture={onPan}>

      {/* usar tudo, mas não ao mesmo tempo */}
      {/* <GestureDetector gesture={Gesture.Race(onLongPress, onPan)}> */}

      {/* Usar tudo e ao mesmo tempo Simultaneous */}
      {/* <GestureDetector gesture={Gesture.Simultaneous(onLongPress, onPan)}> */}

      {/* 
      <GestureDetector gesture={Gesture.Simultaneous(onLongPress, onPan)}>
        <Animated.View style={[styles.element, animatedStyles]} />
      </GestureDetector>
      <Button title="Animar" onPress={handleAnimation} /> */}

      <GestureDetector gesture={onPanButton}>
        <Animated.View style={[animatedStyles, {zIndex: 1}]}>
          <Ball isActive={isActive} />
        </Animated.View>
      </GestureDetector>

      <Button title="Animar" onPress={handleAnimation} />
    </View>
  )
}
