import {
  Canvas,
  Circle,
  BlurMask,
  useValue,
  Group,
  runTiming,
  useSharedValueEffect
} from '@shopify/react-native-skia'
import { Paint } from '@shopify/react-native-skia'
import { useEffect } from 'react'
import { Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

const COLOR = '#664AFF'

type Props = {
  isActive: boolean
}

export function Ball({ isActive }: Props) {
  const circleRadiusOnSharedValue = useSharedValue(60)

  const blur = useValue(0)
  const circleRadiusOne = useValue(60)
  const circleRadiusTwo = useValue(40)
  const circleRadiusThree = useValue(20)

  // Intercambio de valores com o useEffect, com isso ele fica mudando a animações constantemente
  useSharedValueEffect(() => {
    circleRadiusOne.current = circleRadiusOnSharedValue.value
  }, circleRadiusOnSharedValue)

  useEffect(() => {
    if (isActive) {
      // Pra ficar repetindo o efeito de animação, duração da animação e se é infinito
      circleRadiusOnSharedValue.value = withRepeat(
        withTiming(100, {
          duration: 1000
        }),
        // Repetindo animação infinitamente
        -1,
        true
      )

      // Efeitos de animação
      runTiming(blur, 2, {easing: Easing.bounce})
      runTiming(circleRadiusOne, 80, {easing: Easing.elastic(3), duration: 900})
      runTiming(circleRadiusTwo, 55, {easing: Easing.elastic(3), duration: 700})
      runTiming(circleRadiusThree, 25, {easing: Easing.elastic(3), duration: 500})
    } else {
      // Reseta a animação
      circleRadiusOnSharedValue.value = withTiming(60)

      runTiming(blur, 0, {easing: Easing.bounce})
      runTiming(circleRadiusOne, 60, {easing: Easing.elastic(3), duration: 900})
      runTiming(circleRadiusTwo, 40, {easing: Easing.elastic(3), duration: 700})
      runTiming(circleRadiusThree, 20, {easing: Easing.elastic(3), duration: 500})
    }
  }, [isActive])

  return (
    // Canvas é usado para desenhar algo na tela
    <Canvas style={{ width: 200, height: 200 }}>
      {/* Agrupa os objetos dos desenhos, no caso aqui é circulo e aplica 0.8 de opacidade */}
      <Group opacity={0.8}>
        <Circle cx={100} cy={100} r={circleRadiusOne} color={COLOR}>
          <BlurMask blur={blur} style="normal" />
        </Circle>

        <Circle cx={100} cy={100} r={circleRadiusTwo} color={COLOR}>
          <BlurMask blur={blur} style="normal" />
        </Circle>
      </Group>
      
      <Circle cx={100} cy={100} r={circleRadiusThree} color={COLOR}>
        {/* A ordem aqui importa, o blur vem primeiro, depois a bolinha branca dentro do circulo */}
        <BlurMask blur={blur} style="normal" />
        <Paint style="stroke" strokeWidth={10} color="white" opacity={0.5} />
      </Circle>
    </Canvas>
  )
}
