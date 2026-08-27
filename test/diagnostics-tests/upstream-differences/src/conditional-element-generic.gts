import Component from '@glimmer/component';

interface ButtonSignature<AsDiv extends boolean | undefined = undefined> {
  Element: AsDiv extends true ? HTMLDivElement : HTMLButtonElement;
  Args: { asDiv?: AsDiv };
}
declare const Button: abstract new <
  AsDiv extends boolean | undefined = undefined,
>() => Component<ButtonSignature<AsDiv>>;

interface Sig<IsFake extends boolean> {
  Args: { fake?: IsFake };
}

export default class Probe<IsFake extends boolean = false> extends Component<Sig<IsFake>> {
  get asDiv(): IsFake {
    // @ts-expect-error the subclass narrows the type parameter
    return false;
  }

  <template><Button @asDiv={{this.asDiv}} id="x" /></template>
}
