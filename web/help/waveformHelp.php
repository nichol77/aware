
<h2>Waveform</h2>
<p>The AWARE event display has two options for viewing waveforms:</p>
<ul>
<li>Waveform -- This is an oscilloscope-like voltage-time waveform, the units are mV-ns</li>
<li>FFT -- This is a power spectrum computed using the Fast Fourier Transform algorithm, the units are dB/MHz-MHz</li>
</ul>
<p>If you want to know more about how the power spectrum is normalised have a look at my guide to <a href="http://www.hep.ucl.ac.uk/~rjn/saltStuff/fftNormalisation.pdf">FFT Normalisation</a>. What is plotted is the normalised power in each frequency bin (i.e. the dB per MHz), so one needs to integrate the area under the power curve to determine the power in the total power in a region. Finally the DB scale is referenced to 1 mV^2/ns</p>